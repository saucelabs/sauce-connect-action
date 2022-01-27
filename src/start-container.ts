import {getInput, info, debug, isDebug, warning, exportVariable} from '@actions/core'
import {exec} from '@actions/exec'
import {basename} from 'path'
import {join} from 'path'
import {tmpdir} from 'os'
import {copyFileSync} from 'fs'
import {existsSync} from 'fs'
import {promises} from 'fs'
import {wait} from './wait'
import optionMappingJson from './option-mapping.json'
import {stopContainer} from './stop-container'
import {execAndReturn} from './exec-and-return'

const DIR_IN_CONTAINER = '/opt/sauce-connect-action'

const PID_FILE = '/srv/sauce-connect.pid'
const LOG_FILE = join(DIR_IN_CONTAINER, 'sauce-connect.log')
const READY_FILE = join(DIR_IN_CONTAINER, 'sc.ready')

type OptionMapping = {
    actionOption: string
    dockerOption: string
    required?: boolean
    relativePath?: boolean
    flag?: boolean
}
const optionMappings: OptionMapping[] = optionMappingJson

function copyFileToTheSharedVolume(filePath: string, dirInHost: string): string {
    let srcFile = filePath
    let destFile = join(dirInHost, basename(filePath))
    if (!existsSync(filePath)) {
        let workspace:string = process.env.GITHUB_WORKSPACE || ''
        srcFile = join(workspace, filePath)
    }
    if (!existsSync(srcFile)) {
        throw new Error(`${filePath} is not found in ${srcFile}`)
    }
    copyFileSync(srcFile, destFile)
    return join(DIR_IN_CONTAINER, basename(filePath))
}

function buildOptions(dirInHost: string): string[] {
    const params = [
        `--logfile=${LOG_FILE}`,
        `--pidfile=${PID_FILE}`,
        `--readyfile=${READY_FILE}`
    ]

    if (isDebug()) {
        params.push('--verbose')
    }

    for (const optionMapping of optionMappings) {
        const input = getInput(optionMapping.actionOption, {
            required: optionMapping.required
        })

        if (input === '') {
            // user input nothing for this option
        } else if (optionMapping.flag) {
            // for boolean flag options like `--tunnel-pool`
            params.push(`--${optionMapping.dockerOption}`)
        } else if (optionMapping.relativePath) {
            params.push(`--${optionMapping.dockerOption}=${copyFileToTheSharedVolume(input, dirInHost)}`)
        } else {
            params.push(`--${optionMapping.dockerOption}=${input}`)
        }
    }
    return params
}

export async function startContainer(): Promise<string> {
    const DIR_IN_HOST = await promises.mkdtemp(
        join(tmpdir(), `sauce-connect-action`)
    )
    exportVariable('SAUCE_CONNECT_DIR_IN_HOST', DIR_IN_HOST)
    const containerVersion = getInput('scVersion')
    const containerName = `saucelabs/sauce-connect:${containerVersion}`
    await exec('docker', ['pull', containerName])

    const containerId = (
        await execAndReturn(
            'docker',
            [
                'run',
                '--network=host',
                '--detach',
                '-v',
                `${DIR_IN_HOST}:${DIR_IN_CONTAINER}`,
                '--rm',
                containerName
            ].concat(buildOptions(DIR_IN_HOST))
        )
    ).trim()

    let errorOccurred = false
    try {
        await wait(DIR_IN_HOST)
    } catch (e) {
        errorOccurred = true
        await stopContainer(containerId)
        throw e
    } finally {
        if (errorOccurred || isDebug()) {
            try {
                const log = await promises.readFile(
                    join(DIR_IN_HOST, 'sauce-connect.log'),
                    {
                        encoding: 'utf-8'
                    }
                )

                ;(errorOccurred ? warning : debug)(`Sauce connect log: ${log}`)
            } catch {
                //
            }
        }
    }
    info('SC ready')
    return containerId
}

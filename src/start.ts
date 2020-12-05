import {getInput, info} from '@actions/core'
import {exec} from '@actions/exec'
import {join} from 'path'
import {tmpdir} from 'os'
import {promises} from 'fs'
import {wait} from './wait'
import optionMappingJson from './option-mapping.json'
import {stopContainer} from './stop-container'

const LOG_FILE = '/srv/sauce-connect.log'
const PID_FILE = '/srv/sauce-connect.pid'
const READY_FILE = '/opt/sauce-connect-action/sc.ready'

type OptionMapping = {
    actionOption: string
    dockerOption: string
    required?: boolean
    flag?: boolean
}
const optionMappings: OptionMapping[] = optionMappingJson

function buildOptions(): string[] {
    const params = [
        `--logfile=${LOG_FILE}`,
        `--pidfile=${PID_FILE}`,
        `--readyfile=${READY_FILE}`,
        `--verbose`
    ]

    for (const optionMapping of optionMappings) {
        const input = getInput(optionMapping.actionOption, {
            required: optionMapping.required
        })

        if (input === '') {
            // user input nothing for this option
        } else if (optionMapping.flag) {
            // for flag options like --doctor option
            params.push(`--${optionMapping.dockerOption}`)
        } else {
            params.push(`--${optionMapping.dockerOption}=${input}`)
        }
    }
    return params
}

export async function start(): Promise<string> {
    const DIR_IN_HOST = await promises.mkdtemp(
        join(tmpdir(), `sauce-connect-action`)
    )
    const containerVersion = getInput('scVersion')
    const containerName = `saucelabs/sauce-connect:${containerVersion}`
    await exec('docker', ['pull', containerName])
    let containerId = ''
    await exec(
        'docker',
        [
            'run',
            '--network=host',
            '--detach',
            '-v',
            `${DIR_IN_HOST}:/opt/sauce-connect-action`,
            '--rm',
            containerName
        ].concat(buildOptions()),
        {
            listeners: {
                stdout: (data: Buffer) => {
                    containerId += data.toString()
                }
            }
        }
    )
    containerId = containerId.trim()
    try {
        await wait(DIR_IN_HOST)
    } catch (e) {
        await stopContainer(containerId)
        throw e
    }
    info('SC ready')
    return containerId
}

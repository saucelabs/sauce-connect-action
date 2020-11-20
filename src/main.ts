import {getInput, info, saveState, setFailed} from '@actions/core'
import {exec} from '@actions/exec'
import {join} from 'path'
import {tmpdir} from 'os'
import {promises} from 'fs'
import {wait} from './wait'
import optionMappingJson from './option-mapping.json'

const CONTAINER_VERSION = '4.6.2'
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

async function run(): Promise<void> {
    const DIR_IN_HOST = await promises.mkdtemp(
        join(tmpdir(), `sauce-connect-action`)
    )
    const containerName = `saucelabs/sauce-connect:${CONTAINER_VERSION}`
    try {
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
        saveState('containerId', containerId.trim())
        await wait(DIR_IN_HOST)
        info('SC ready')
    } catch (error) {
        setFailed(error.message)
    }
}

run()

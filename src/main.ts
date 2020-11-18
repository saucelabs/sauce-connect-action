import {getInput, saveState, setFailed} from '@actions/core'
import {exec} from '@actions/exec'
import {info} from 'console'
import optionMappingJson from './option-mapping.json'

const CONTAINER_VERSION = '4.6.2'
const LOG_FILE = '/srv/sauce-connect.log'
const PID_FILE = '/srv/sauce-connect.pid'

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
    const containerName = `saucelabs/sauce-connect:${CONTAINER_VERSION}`
    return new Promise<void>(async (resolve, reject) => {
        try {
            await exec('docker', ['pull', containerName])
            let containerId = ''
            await exec(
                'docker',
                [
                    'run',
                    '--network=host',
                    '--detach',
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
            setTimeout(() => {
                // 30 seconds is generally enough for Sauce Connect to start
                info('SC ready')
                resolve(void 0)
            }, 30 * 1000)
        } catch (error) {
            setFailed(error.message)
            reject(error)
        }
    })
}

run()

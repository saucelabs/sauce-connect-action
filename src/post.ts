import {getState, info, warning, setFailed} from '@actions/core'
import {exec} from '@actions/exec'

async function run(): Promise<void> {
    try {
        const containerId = getState('containerId')
        if (!containerId) {
            warning(
                'No state found. Assume that no container run in this workflow run.'
            )
            return
        }
        info(`Trying to stop the docker container with ID ${containerId}...`)
        await exec('docker', ['container', 'stop', containerId])
        info('Done.')
    } catch (error) {
        setFailed(error.message)
    }
}

run()

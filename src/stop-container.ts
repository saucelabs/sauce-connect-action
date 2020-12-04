import {info} from '@actions/core'
import {exec} from '@actions/exec'

export async function stopContainer(containerId: string): Promise<void> {
    info(`Trying to stop the docker container with ID ${containerId}...`)
    await exec('docker', ['container', 'stop', containerId])
    info('Done.')
}

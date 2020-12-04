import {exec} from '@actions/exec'
import {info} from 'console'

export async function stopContainer(containerId: string): Promise<void> {
    info(`Trying to stop the docker container with ID ${containerId}...`)
    await exec('docker', ['container', 'stop', containerId])
    info('Done.')
}

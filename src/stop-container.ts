import {info} from '@actions/core'
import {exec} from '@actions/exec'
import {execAndReturn} from './exec-and-return'

export async function stopContainer(containerId: string): Promise<void> {
    info(`Trying to stop the docker container with ID ${containerId}...`)
    const running =
        (
            await execAndReturn('docker', [
                'ps',
                '-q',
                '-f',
                `id=${containerId}`
            ])
        ).trim() !== ''

    if (running) {
        await exec('docker', ['container', 'stop', containerId])
    } else {
        info('Container not running.')
    }
    info('Done.')
}

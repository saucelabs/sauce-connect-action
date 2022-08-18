import {info} from '@actions/core'
import {exec} from '@actions/exec'

export async function stopSc(pid: string): Promise<void> {
    info(`Trying to stop sc with pid ${pid}`)
    await exec(`kill ${pid}`)
    info('Done')
}

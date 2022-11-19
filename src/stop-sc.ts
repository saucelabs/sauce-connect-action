import {info, warning} from '@actions/core'
import {exec} from '@actions/exec'

export async function stopSc(pid: string): Promise<void> {
    info(`Trying to stop sc with pid ${pid}`)
    try {
        await exec(`kill ${pid}`)
    } catch (e) {
        warning(
            `Failed to stop sc (${
                e instanceof Error ? e.message : e
            })). It might already have stopped`
        )
    }
    info('Done')
}

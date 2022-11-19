import {info, warning} from '@actions/core'
import process from 'process'

export async function stopSc(pid: string): Promise<void> {
    info(`Trying to stop sc with pid ${pid}`)
    try {
        process.kill(parseInt(pid))
    } catch (e) {
        warning(
            `Failed to stop sc (${
                e instanceof Error ? e.message : e
            })). It might already have stopped`
        )
    }
    info('Done')
}

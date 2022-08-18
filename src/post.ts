import {getState, warning, setFailed} from '@actions/core'
import {stopSc} from './stop-sc'

async function run(): Promise<void> {
    const pid = getState('scPid')
    if (!pid) {
        warning('No state found. Assume that no sc ran in this workflow run.')
        return
    }

    await stopSc(pid)
}

// eslint-disable-next-line github/no-then
run().catch(error => setFailed(error.message))

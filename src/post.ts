import {getState, warning, setFailed} from '@actions/core'
import {stopContainer} from './stop-container'

async function run(): Promise<void> {
    const containerId = getState('containerId')
    if (!containerId) {
        warning(
            'No state found. Assume that no container run in this workflow run.'
        )
        return
    }

    await stopContainer(containerId)
}

// eslint-disable-next-line github/no-then
run().catch(error => setFailed(error.message))

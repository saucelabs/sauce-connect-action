import {saveState, setFailed} from '@actions/core'
import {start} from './start'

async function run(): Promise<void> {
    const containerId = await start()
    saveState('containerId', containerId)
}

// eslint-disable-next-line github/no-then
run().catch(error => setFailed(error.message))

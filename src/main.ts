import {getInput, saveState, setFailed, warning} from '@actions/core'
import {startContainer} from './start-container'

const retryDelays = [1, 2, 3].map(a => a * 1000)

async function run(): Promise<void> {
    const retryTimeout = parseInt(getInput('retryTimeout'), 10) * 1000 * 60
    const startTime = Date.now()

    for (let i = 0; ; i++) {
        try {
            const containerId = await startContainer()
            saveState('containerId', containerId)
            return
        } catch (e) {
            if (Date.now() - startTime >= retryTimeout) {
                break
            }
            const delay = retryDelays[Math.min(retryDelays.length - 1, i)]
            warning(
                `Error occurred on attempt ${i + 1} (${
                    e.message
                }). Retrying in ${delay} ms...`
            )
            await new Promise<void>(resolve => setTimeout(resolve, delay))
        }
    }
    throw new Error('Timed out')
}

// eslint-disable-next-line github/no-then
run().catch(error => setFailed(error.message))

import {getInput, saveState, setFailed, warning} from '@actions/core'
import {start} from './start'

const retryDelays = [1, 1, 1, 2, 3, 4, 5, 10, 20, 40, 60].map(a => a * 1000)

async function run(): Promise<void> {
    const retryTimeout = parseInt(getInput('retryTimeout'), 10) * 1000
    const startTime = Date.now()

    for (let i = 0; ; i++) {
        try {
            const containerId = await start()
            saveState('containerId', containerId)
            return
        } catch (e) {
            if (Date.now() - startTime >= retryTimeout) {
                break
            }
            const delay = retryDelays[Math.min(retryDelays.length - 1, i)]
            warning(
                `Error occurred on attempt ${i + 1}. Retrying in ${delay} ms...`
            )
            await new Promise(resolve => setTimeout(() => resolve(), delay))
        }
        throw new Error('Timed out')
    }
}

// eslint-disable-next-line github/no-then
run().catch(error => setFailed(error.message))

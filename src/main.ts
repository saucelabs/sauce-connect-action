import {getInput, setFailed, warning} from '@actions/core'
import {installSauceConnect} from './installer'
import {startSc} from './start-sc'
import {appendFileSync} from 'fs'

const retryDelays = [1, 1, 1, 2, 3, 4, 5, 10, 20, 40, 60].map(a => a * 1000)

async function run(): Promise<void> {
    const scVersion = getInput('scVersion')
    const retryTimeout = parseInt(getInput('retryTimeout'), 10) * 1000 * 60
    const startTime = Date.now()

    await installSauceConnect(scVersion)

    for (let i = 0; ; i++) {
        try {
            const pid = await startSc()
            const githubState = process.env.GITHUB_STATE || '/tmp/github_state'
            appendFileSync(githubState, `scPid=${pid}`, {
                encoding: 'utf8'
            })
            return
        } catch (e) {
            if (Date.now() - startTime >= retryTimeout) {
                break
            }
            const delay = retryDelays[Math.min(retryDelays.length - 1, i)]
            warning(
                `Error occurred on attempt ${i + 1} (${
                    e instanceof Error ? e.message : e
                }). Retrying in ${delay} ms...`
            )
            await new Promise<void>(resolve => setTimeout(resolve, delay))
        }
    }
    throw new Error('Timed out')
}

// eslint-disable-next-line github/no-then
run().catch(error => setFailed(error.message))

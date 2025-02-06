import * as core from '@actions/core'
import {startSc} from './start-sc'
import {appendFileSync} from 'fs'

const retryDelays = [1, 1, 1, 2, 3, 4, 5, 10, 20, 40, 60].map(a => a * 1000)

async function run(): Promise<void> {
    const retryTimeout = parseInt(core.getInput('retryTimeout'), 10) * 1000 * 60
    const startTime = Date.now()

    for (let i = 0; ; i++) {
        try {
            const pid = await startSc(core)
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
            const errMsg = e instanceof Error ? e.message : e
            core.warning(`Error occurred on attempt ${i + 1} (${errMsg}). Retrying in ${delay} ms...`)
            core.warning("Check sauce connect logs for more information")
            await new Promise<void>(resolve => setTimeout(resolve, delay))
        }
    }
    throw new Error('Timed out')
}

// eslint-disable-next-line github/no-then
run().catch(error => core.setFailed(error.message))

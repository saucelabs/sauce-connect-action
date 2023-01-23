import { debug, getInput, isDebug, warning } from '@actions/core'
import { which } from '@actions/io'
import { spawn } from 'child_process'
import { info } from 'console'
import { mkdtempSync, readFileSync } from 'fs'
import { tmpdir } from 'os'
import { dirname, join } from 'path'
import optionMappingJson from './option-mapping.json'
import { stopSc } from './stop-sc'
import { wait } from './wait'

const tmp = mkdtempSync(join(tmpdir(), `sauce-connect-action`))
const LOG_FILE = join(tmp, 'sauce-connect.log')
const READY_FILE = join(tmp, 'sc.ready')

type OptionMapping = {
    actionOption: string
    scOption: string
    required?: boolean
    relativePath?: boolean
    flag?: boolean
}
const optionMappings: OptionMapping[] = optionMappingJson

function buildOptions(): string[] {
    const params = [
        `--logfile=${LOG_FILE}`,
        `--extra-info={"runner": "github-action"}`,
        `--readyfile=${READY_FILE}`
    ]

    if (isDebug()) {
        params.push('--verbose')
    }

    for (const optionMapping of optionMappings) {
        const input = getInput(optionMapping.actionOption, {
            required: optionMapping.required
        })

        if (input === '') {
            // user input nothing for this option
        } else if (optionMapping.flag) {
            // for boolean flag options like `--tunnel-pool`
            params.push(`--${optionMapping.scOption}`)
        } else {
            params.push(`--${optionMapping.scOption}=${input}`)
        }
    }
    return params
}

export async function startSc(): Promise<string> {
    const cmd = await which('sc')
    const args = buildOptions()

    info(`[command]${cmd} ${args.map(arg => `${arg}`).join(' ')}`)
    const child = spawn(cmd, args, {
        stdio: 'ignore',
        detached: true
    })
    child.unref()

    let errorOccurred = false
    try {
        await wait(dirname(READY_FILE))
        info('SC ready')
        return String(child.pid)
    } catch (e) {
        errorOccurred = true
        if (child.pid) {
            await stopSc(String(child.pid))
        }
        throw e
    } finally {
        if (errorOccurred || isDebug()) {
            try {
                const log = readFileSync(LOG_FILE, {
                    encoding: 'utf-8'
                })
                    ; (errorOccurred ? warning : debug)(`Sauce connect log: ${log}`)
            } catch (e2) {
                warning(`Unable to access Sauce connect log file: ${e2}.
                This could be caused by an error with the Sauce Connect or Github Action configuration that prevented Sauce Connect from starting up.
                Please verify your configuration and ensure any referenced files are available.`)
            }
        }
    }
}

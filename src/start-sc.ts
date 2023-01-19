import {debug, getInput, isDebug, warning} from '@actions/core'
import {which} from '@actions/io'
import {spawn} from 'child_process'
import {info} from 'console'
import {mkdtempSync, readFileSync, existsSync, openSync} from 'fs'
import {tmpdir} from 'os'
import {dirname, join} from 'path'
import optionMappingJson from './option-mapping.json'
import {stopSc} from './stop-sc'
import {wait} from './wait'

let tmp = '';
let LOG_FILE = '';
let READY_FILE = '';

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

        if (input === '' && optionMapping.actionOption === 'logFile') {
            params.push(`--logfile=${LOG_FILE}`)
        }else if (optionMapping.flag) {
            // for boolean flag options like `--tunnel-pool`
            params.push(`--${optionMapping.scOption}`)
        } else {
            params.push(`--${optionMapping.scOption}=${input}`)
        }
    }
    return params
}

export async function startSc(): Promise<string> {
    try {
        tmp = mkdtempSync(join(tmpdir(), `sauce-connect-action`))
        openSync(join(tmp, 'sauce-connect.log'), 'w');
    } catch (e) {
        console.error(`Error creating tmp directory for log file: ${e}`);
    }
    
    LOG_FILE = join(tmp, 'sauce-connect.log')
    READY_FILE = join(tmp, 'sc.ready')
    
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
            const log = readFileSync(LOG_FILE, {
                encoding: 'utf-8'
            })

            ;(errorOccurred ? warning : debug)(`Sauce connect log: ${log}`)
        }
    }
}

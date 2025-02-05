import * as actionsCore from '@actions/core'
import {mkdtempSync, writeFileSync} from 'fs'
import {tmpdir} from 'os'
import {join} from 'path'
import SauceLabs, {SauceConnectOptions, SauceLabsOptions} from 'saucelabs'
import {SAUCE_CONNECT_CLI_PARAMS} from 'saucelabs/build/constants'
import {Tail} from 'tail'
import {ChildProcess} from 'node:child_process'

const DEFAULT_RUNNER_NAME = 'github-action'
const DEFAULT_LOG_FILE = 'sauce-connect.log'

type CoreType = typeof actionsCore

export async function startSc(core: CoreType): Promise<string> {
    const tmp = mkdtempSync(join(tmpdir(), `sauce-connect-action`))
    const LOG_FILE = join(tmp, DEFAULT_LOG_FILE)

    core.exportVariable('SAUCE_CONNECT_DIR_IN_HOST', tmp)

    const slAPI = new SauceLabs({
        user: core.getInput('username'),
        key: core.getInput('accessKey'),
        region: core.getInput('region') as SauceLabsOptions['region'],
        proxy: core.getInput('proxySauce') || undefined
    })

    const params: SauceConnectOptions = {
        logger: core.info,
        logLevel: core.isDebug() ? 'debug' : 'info',
        logFile: LOG_FILE,
        metadata: ''
    }

    const proxyValue = core.getInput('proxy')
    if (proxyValue) {
        params.scUpstreamProxy = proxyValue
    }

    for (const param of SAUCE_CONNECT_CLI_PARAMS) {
        const name = param.name.replace(/-[a-z]/g, (r: string) =>
            r.slice(1).toUpperCase()
        )
        const value = core.getInput(name)
        if (value !== undefined && value !== '') {
            // @ts-expect-error not sure how to make sure that the name is a valid key
            params[name] = value
        }
    }

    if (!params.metadata?.includes('runner=')) {
        params.metadata = [params.metadata, `runner=${DEFAULT_RUNNER_NAME}`]
            .filter(Boolean)
            .join(',')
    }

    // Print logs
    writeFileSync(LOG_FILE, '')
    const tail = new Tail(LOG_FILE)
    tail.on('line', core.info)

    try {
        const result = await slAPI.startSauceConnect(params)
        detachSauceConnect(result.cp)
        return String(result.cp.pid)
    } catch (err) {
        throw err
    } finally {
        tail.unwatch()
    }
}

function detachSauceConnect(cp: ChildProcess): void {
    cp.unref()
    cp.stderr?.unpipe()
    cp.stderr?.destroy()
    cp.stdout?.unpipe()
    cp.stdout?.destroy()
    cp.stdin?.end()
    cp.stdin?.destroy()
}

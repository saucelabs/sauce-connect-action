import {addPath, info} from '@actions/core'
import {cacheDir, downloadTool, extractTar, find} from '@actions/tool-cache'
import {join} from 'path'

export async function installSauceConnect(scVersion: string): Promise<void> {
    let scPath = find('sc', scVersion, process.arch)
    const name = `sc-${scVersion}-linux${
        process.arch === 'arm64' ? '-arm64' : ''
    }`

    if (scPath) {
        info(`Found in cache @ ${scPath}`)
    } else {
        info(`Attempting to download sc@${scVersion}...`)
        const downloadedPath = await downloadTool(
            `https://saucelabs.com/downloads/${name}.tar.gz`
        )

        info('Extracting ...')
        const extractedPath = await extractTar(downloadedPath)

        info('Adding to the cache ...')
        scPath = await cacheDir(extractedPath, 'sc', scVersion, process.arch)
    }

    addPath(join(scPath, name, 'bin'))
}

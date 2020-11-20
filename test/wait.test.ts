import {wait} from '../src/wait'
import {promises} from 'fs'
import {join} from 'path'
import {tmpdir} from 'os'

async function touch(filepath: string) {
    const fileHandle = await promises.open(filepath, 'w')
    return fileHandle.close()
}

describe('watch()', () => {
    it('returns a promise which will be resolved when the target file is touched', async () => {
        const tmpDir = await promises.mkdtemp(
            join(tmpdir(), 'sauce-connect-action-')
        )
        const readyFile = join(tmpDir, 'sc.ready')
        const watcher = wait(tmpDir)
        touch(readyFile)
        return watcher
    })
})

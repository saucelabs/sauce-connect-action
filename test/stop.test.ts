import {describe, test} from '@jest/globals'
import {stopSc} from '../src/stop-sc'

describe('stop-sc', () => {
    test('attempts to stop a process', async () => {
        await stopSc('999999')
    })
})

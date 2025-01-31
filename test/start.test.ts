import * as actionsCore from '@actions/core'
import {expect, jest, describe, test, beforeEach} from '@jest/globals'
import {when} from 'jest-when'
import {startSc} from '../src/start-sc'

type CoreType = typeof actionsCore

describe('stop-sc', () => {
    let core: jest.MockedObject<CoreType>

    beforeEach(() => {
        core = jest.createMockFromModule<CoreType>('@actions/core')
    })

    test('region needs to be passed', async () => {
        core.getInput.mockReturnValue('')
        const error = await startSc(core).catch(err => err)
        expect(error).toEqual(new Error('Missing region'))
    })

    test('tunnelName needs to be passed', async () => {
        when(core.getInput).calledWith('region').mockReturnValue('us')
        const error = await startSc(core).catch(err => err)
        expect(error).toEqual(new Error('Missing tunnel-name'))
    })

    test('passing invalid proxy', async () => {
        when(core.getInput)
            .calledWith('proxySauce')
            .mockReturnValue('invalid-proxy')
        const error = await startSc(core).catch(err => err)
        expect(error).toEqual(
            new Error(
                'Only http and https protocols are supported for proxying traffic.\nWe got null'
            )
        )
    })
})

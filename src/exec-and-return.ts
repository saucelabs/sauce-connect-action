import {exec} from '@actions/exec'

export async function execAndReturn(
    commandLine: string,
    args?: string[]
): Promise<string> {
    let output = ''
    await exec(commandLine, args, {
        listeners: {
            stdout: (data: Buffer) => {
                output += data.toString()
            }
        }
    })
    return output
}

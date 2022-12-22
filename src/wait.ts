import {watch} from 'fs'

const timeoutSeconds = 60

export async function wait(dir: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            watcher.close()
            reject(
                new Error(
                    `timeout: SC was not ready even after we wait ${timeoutSeconds} secs`
                )
            )
        }, timeoutSeconds * 1000)

        const watcher = watch(dir, (eventType, filename) => {
            if (filename !== 'sc.ready') {
                return
            }
            clearTimeout(timeout)
            watcher.close()
            resolve(void 0)
        })
    })
}

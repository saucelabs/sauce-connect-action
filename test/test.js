const assert = require('assert')
const { remote } = require('webdriverio')

let browser
;(async () => {
    browser = await remote({
        user: process.env.SAUCE_USERNAME,
        key: process.env.SAUCE_ACCESS_KEY,
        capabilities: {
            browserName: 'chrome',
            platformName: 'Windows 10',
            browserVersion: 'latest',
            'sauce:options': {
                tunnelIdentifier: 'github-action-tunnel',
                build: `Build #${process.env.GITHUB_RUN_NUMBER}`
            }
        }
    })

    await browser.url('http://127.0.0.1:8080')

    const body = await browser.$('body')
    assert.equal(await body.getText(), 'Hello World!')

    await browser.deleteSession()
})().then(
    () => process.exit(0),
    async (e) => {
        console.error(e)
        if (browser) {
            await browser.deleteSession()
        }
        process.exit(1)
    }
)

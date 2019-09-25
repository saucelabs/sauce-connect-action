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
                tunnelIdentifier: process.env.TUNNEL_IDENTIFIER
            }
        }
    })

    await browser.url('http://localhost:8080')

    const body = await browser.$('body')
    assert.equal(await body.getText(), 'Hello World!')

    await browser.deleteSession()
})().then(
    () => process.exit(0),
    async (e) => {
        console.error(e)
        await browser.deleteSession()
        process.exit(1)
    }
)

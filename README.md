# Sauce Connect Proxy GitHub Action

A GitHub Action to launch [Sauce Connect Proxy](https://docs.saucelabs.com/secure-connections/), enabling secure testing of your applications.

## Example

```yaml
jobs:
    test:
        runs-on: ubuntu-latest
        name: Action Test
        steps:
            - uses: actions/checkout@v4
            - uses: saucelabs/sauce-connect-action@v3
              with:
                  username: ${{ secrets.SAUCE_USERNAME }}
                  accessKey: ${{ secrets.SAUCE_ACCESS_KEY }}
                  region: us
                  tunnelName: github-action-tunnel
                  configFile: ${{ github.workspace }}/sc-configuration/config.yaml
```

## Migrating from v2 to v3

Version 2.x of this action works with Sauce Connect 4, which reached end-of-support in Q4 2024. Version 3.x supports the latest Sauce Connect 5.

To properly migrate to Sauce Connect 5, please refer to [Migrating from Sauce Connect Proxy 4](https://docs.saucelabs.com/secure-connections/sauce-connect-5/migrating/).

## Inputs

| Name         | Required | Description |
|-------------|----------|-------------|
| `username`  | ✅ Yes   | Sauce Labs [username](https://docs.saucelabs.com/dev/cli/sauce-connect-5/run/#username). |
| `accessKey` | ✅ Yes   | Sauce Labs [API Access Key](https://docs.saucelabs.com/dev/cli/sauce-connect-5/run/#access-key). |
| `region`    | ✅ Yes   | Sauce Labs [region](https://github.com/saucelabs/node-saucelabs?tab=readme-ov-file#region). |
| `configFile` | No      | Path to a Sauce Connect Proxy [configuration file](https://docs.saucelabs.com/secure-connections/sauce-connect-5/operation/configuration/). Use an absolute path (e.g., `${{ github.workspace }}/sc-configuration/config.yaml`). |
| `scVersion` | No      | The version of the Sauce Connect client to use. Defaults to the latest release. Check the [official documentation](https://docs.saucelabs.com/secure-connections/sauce-connect-5/installation/) for available versions. |
| `retryTimeout` | No  | Maximum retry time in minutes before stopping. Default: `10`. |


## Additional configuration

For more configuration options, refer to:
- [action.yml](action.yml)
- [Sauce Connect 5 CLI](https://docs.saucelabs.com/dev/cli/sauce-connect-5/run/)


## Accessing Sauce Connect Proxy Logs

For debugging or auditing purposes, you can save the Sauce Connect Proxy logs using the [upload-artifact](https://github.com/actions/upload-artifact).

Example (logs saved only on failure):

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    name: Action Test
    steps:
      - uses: actions/checkout@v4
      - uses: saucelabs/sauce-connect-action@v3
        with:
          username: ${{ secrets.SAUCE_USERNAME }}
          accessKey: ${{ secrets.SAUCE_ACCESS_KEY }}
          region: us
          tunnelName: github-action-tunnel
          configFile: ${{ github.workspace }}/sc-configuration/config.yaml

      - uses: actions/upload-artifact@v4
        if: ${{ failure() }}
        with:
          name: sauce-connect-log
          path: ${{ env.SAUCE_CONNECT_DIR_IN_HOST }}/sauce-connect.log
```

## Development

To run locally, use:

```bash
INPUT_REGION=us-west-1 INPUT_TUNNELNAME=sauce-connect-test INPUT_USERNAME=username INPUT_ACCESSKEY=accesskey node ./dist/main/index.js
```

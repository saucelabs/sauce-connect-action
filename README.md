# Sauce Connect Proxy GitHub Action

A GitHub action to launch [Sauce Connect Proxy](https://docs.saucelabs.com/secure-connections/sauce-connect).

## Example

```yaml
jobs:
    test:
        runs-on: ubuntu-latest
        name: Action Test
        steps:
            # ...
            - uses: actions/checkout@v4  # reference files in the current repository
            - uses: saucelabs/sauce-connect-action@v3
              with:
                  username: ${{ secrets.SAUCE_USERNAME }}
                  accessKey: ${{ secrets.SAUCE_ACCESS_KEY }}
                  region: us
                  tunnelName: github-action-tunnel
                  configFile: ${{ github.workspace }}/sc-configuration/config.yaml
            # ...
```

## Migration from v2 to v3

Please refer to [Migrating from Sauce Connect Proxy 4](https://docs.saucelabs.com/secure-connections/sauce-connect-5/migrating/)

## Inputs

### `username`:

**Required** Sauce Labs [user name](https://docs.saucelabs.com/dev/cli/sauce-connect-5/run/#username).

### `accessKey`:

**Required** Sauce Labs [API Access Key](https://docs.saucelabs.com/dev/cli/sauce-connect-5/run/#access-key).

### `region`:

**Required** Sauce Labs [region](https://github.com/saucelabs/node-saucelabs?tab=readme-ov-file#region).

### `configFile`:

Sauce Connect Proxy [configuration file](https://docs.saucelabs.com/secure-connections/sauce-connect-5/operation/configuration/).

Only an absolute path to the file is supported at the moment (i.e. must prepend the relative path to the file in the repo with `github.workspace`, see the example above).

### `scVersion`:

(Optional) version of the saucelabs/sauce-connect client. Use the latest sauce-connect release by default. Current latest version can be found in [the official documentation](https://docs.saucelabs.com/secure-connections/sauce-connect-5/installation/)

### `retryTimeout`:

Do not retry if this amount of minutes has passed since starting. (default: "10")

## Additional configuration

Please refer to [action.yml](action.yml) or [Sauce Labs documentation](https://docs.saucelabs.com/dev/cli/sauce-connect-5/run/) for each option documentation.


## Sauce Connect Proxy log

Sometimes, it's beneficial to access the Sauce Connect Proxy log for debugging or an audit.

It can be done with [upload-artifact](https://github.com/actions/upload-artifact) GitHub Action.
Optionally, a failure condition may be specified to store the log only in case of a failure.

```yaml
jobs:
    test:
        runs-on: ubuntu-latest
        name: Action Test
        steps:
            # ...
            - uses: actions/checkout@v3  # reference files in the current repository
            - uses: saucelabs/sauce-connect-action@v2
              with:
                  username: ${{ secrets.SAUCE_USERNAME }}
                  accessKey: ${{ secrets.SAUCE_ACCESS_KEY }}
                  tunnelName: github-action-tunnel
                  configFile: ${{ github.workspace }}/sc-configuration/config.yaml
            # ...

            - uses: actions/upload-artifact@v4
              if: ${{ failure() }}
              with:
                name: sauce-connect-log
                path: ${{ env.SAUCE_CONNECT_DIR_IN_HOST }}/sauce-connect.log
```


## Development

Run locally
```bash
INPUT_REGION=us-west-1 INPUT_TUNNELNAME=sauce-connect-test INPUT_USERNAME=username INPUT_ACCESSKEY=accesskey node ./dist/main/index.js
```

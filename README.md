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
            - uses: actions/checkout@v3  # reference files in the current repository
            - uses: saucelabs/sauce-connect-action@v2
              with:
                  username: ${{ secrets.SAUCE_USERNAME }}
                  accessKey: ${{ secrets.SAUCE_ACCESS_KEY }}
                  tunnelName: github-action-tunnel
                  configFile: ${{ github.workspace }}/sc-configuration/config.yaml
            # ...
```

## Inputs

### `username`:

**Required** Sauce Labs [user name](https://docs.saucelabs.com/dev/cli/sauce-connect-proxy/#--user).

### `accessKey`:

**Required** Sauce Labs [API Access Key](https://docs.saucelabs.com/dev/cli/sauce-connect-proxy/#--api-key).

### `configFile`:

Sauce Connect Proxy [configuration file](https://docs.saucelabs.com/secure-connections/sauce-connect/setup-configuration/yaml-config/).

Only an absolute path to the file is supported at the moment (i.e. must prepend the relative path to the file in the repo with `github.workspace`, see the example above).

### `scVersion`:

(Optional) version of the saucelabs/sauce-connect docker image. Use the latest sauce-connect release by default (the current latest version is 4.8.2).

### `retryTimeout`:

Do not retry if this amount of minutes has passed since starting. (default: "10")

## Addiotional configuration

Please refer to [Sauce Labs documentation](https://docs.saucelabs.com/dev/cli/sauce-connect-proxy/index.html) for each option documentation.

- [cainfo](https://docs.saucelabs.com/dev/cli/sauce-connect-proxy/index.html#--cainfo)
- [configFile](https://docs.saucelabs.com/dev/cli/sauce-connect-proxy/index.html#--config-file)
- `directDomains`
- `fastFailRegexps`
- `noAutodetect`
- `noSSLBumpDomains`
- `pac`
- `proxy`
- `proxyTunnel`
- `proxyUserpwd`
- [region](https://docs.saucelabs.com/dev/cli/sauce-connect-proxy/index.html#--region)
- `scproxyPort`
- `sePort`
- `sharedTunnel`
- `statusAddress`
- `tunnelDomains`
- `tunnelIdentifier`
- `tunnelName`
- `tunnelPool`
- `verbose`

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

            - uses: actions/upload-artifact@v3
              if: ${{ failure() }}
              with:
                name: sauce-connect-log
                path: ${{ env.SAUCE_CONNECT_DIR_IN_HOST }}/sauce-connect.log
```

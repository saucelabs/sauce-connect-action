# Sauce Connect Proxy GitHub Action

A GitHub action to launch Sauce Connect Proxy.

## Example

```yaml
jobs:
    test:
        runs-on: ubuntu-latest
        name: Action Test
        steps:
            # ...
            - uses: saucelabs/sauce-connect-action@v2
              with:
                  username: ${{ secrets.SAUCE_USERNAME }}
                  accessKey: ${{ secrets.SAUCE_ACCESS_KEY }}
                  tunnelIdentifier: github-action-tunnel
                  configFile: ${{ github.workspace }}/sc-configuration/config.yaml
                  scVersion: 4.7.1
            # ...
```

## Inputs

### `username`:

**Required** Sauce Labs user name.

### `accessKey`:

**Required** Sauce Labs API Key.

### `configFile`:

Sauce Connect Proxy [configuration file](https://docs.saucelabs.com/secure-connections/sauce-connect/setup-configuration/yaml-config/).

Only an absolute path to the file is supported at the moment (i.e. must prepend the relative path to the file in the repo with `github.workspace`, see the example above).

### `scVersion`:

Version of the saucelabs/sauce-connect docker image.

### `retryTimeout`:

Do not retry if this amount of minutes has passed since starting. (default: "10")

## Addiotional configuration

Please refer to [Sauce Labs documentation](https://docs.saucelabs.com/dev/cli/sauce-connect-proxy/index.html) for each option documentation.

- `cainfo`
- `configFile`
- `directDomains`
- `fastFailRegexps`
- `metricsAddress`
- `noAutodetect`
- `noRemoveCollidingTunnels`
- `noSSLBumpDomains`
- `pac`
- `proxy`
- `proxyTunnel`
- `proxyUserpwd`
- `region`
- `scproxyPort`
- `sePort`
- `sharedTunnel`
- `tunnelDomains`
- `tunnelIdentifier`
- `tunnelName`
- `tunnelPool`
- `verbose`

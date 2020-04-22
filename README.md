Sauce Connect Proxy GitHub Action
=================================

A GitHub action to launch Sauce Connect Proxy.

## Example

```yaml
jobs:
    test:
        runs-on: ubuntu-latest
        name: Action Test
        steps:
            # ...
            - uses: saucelabs/sauce-connect-action@v1
              with:
                username: ${{ secrets.SAUCE_USERNAME }}
                accessKey: ${{ secrets.SAUCE_ACCESS_KEY }}
                tunnelIdentifier: github-action-tunnel
            # ...
```

## Inputs

### `username`:
**Required** Sauce Labs user name.

### `accesskey`:
**Required** Sauce Labs API Key.

### `cainfo`:
CA certificate bundle to use for verifying REST connections. (default "/usr/local/etc/openssl/cert.pem")

### `capath`:
Directory of CA certs to use for verifying REST connections. (default "/etc/ssl/certs")

### `configFile`:
Path to YAML config file. Please refer to https://wiki.saucelabs.com/display/DOCS/Sauce+Connect+Command+Line +Reference for a sample configuration file.

### `directDomains`:
Comma-separated list of domains. Requests whose host matches one of these will be relayed directly through the  internet, instead of through the tunnel.

### `dns`:
"Use specified name server. To specify multiple servers, separate them with comma. Use IP addresses, optionally  with a port number, the two separated by a colon. Example: --dns 8.8.8.8,8.8.4.4:53"

### `doctor`:
Perform checks to detect possible misconfiguration or problems.

### `fastFailRegexps`:
Comma-separated list of regular expressions. Requests matching one of these will get dropped instantly and will  not go through the tunnel.

### `logStats`:
Log statistics about HTTP traffic every <seconds>.

### `maxLogsize`:
Rotate logfile after reaching <bytes> size. Disabled by default.

### `maxMissedAcks`:
The maximum amount of keepalive acks that can be missed before the client will trigger a reconnect. (default 30)

### `metricsAddress`:
'host:port for the internal web server used to expose client side metrics. (default "localhost:8888")'

### `noAutodetect`:
Disable the autodetection of proxy settings.

### `noProxyCaching`:
Disable caching in Sauce Connect. All requests will be sent through the tunnel.

### `noRemoveCollidingTunnels`:
Don't remove identified tunnels with the same name, or any other default tunnels if this is a default tunnel. Jobs will be distributed between these tunnels, enabling load balancing and high availability. By default, colliding tunnels will be removed when Sauce Connect is starting up.

### `noSSLBumpDomains`:
Comma-separated list of domains. Requests whose host matches one of these will not be SSL re-encrypted.

### `pac`:
Proxy autoconfiguration. Can be an http(s) or local file:// (absolute path only) URI.

### `proxy`:
Proxy host and port that Sauce Connect should use to connect to the Sauce Labs cloud.

### `proxyTunnel`:
Use the proxy configured with -p for the tunnel connection.

### `proxyUserpwd`:
Username and password required to access the proxy configured with -p.

### `readyfile`:
File that will be touched to signal when tunnel is ready.

### `restUrl`:
'Advanced feature: Connect to Sauce REST API at alternative URL. Use only if directed to do so by Sauce Labs  support. (default "https://saucelabs.com/rest/v1")'

### `scproxyPort`:
Port on which scproxy will be listening.

### `scproxyReadLimit`:
Rate limit reads in scproxy to X bytes per second. This option can be used to adjust local network transfer rate in order not to overload the tunnel connection.

### `scproxyWriteLimit`:
Rate limit writes in scproxy to X bytes per second. This option can be used to adjust local network transfer rate in order not to overload the tunnel connection.

### `sePort`:
Port on which Sauce Connect's Selenium relay will listen for requests. Selenium commands reaching Connect on this port will be relayed to Sauce Labs securely and reliably through Connect's tunnel (default 4445)

### `sharedTunnel`:
Let sub-accounts of the tunnel owner use the tunnel if requested.

### `tunnelCainfo`:
CA certificate bundle to use for verifying tunnel connections. (default "/usr/local/etc/openssl/cert.pem")

### `tunnelCapath`:
Directory of CA certs to use for verifying tunnel connections. (default "/etc/ssl/certs")

### `tunnelCert`:
'Specify certificate to use for the tunnel connection, either public or private. Default: private. (default "private")'

### `tunnelDomains`:
Inverse of '--direct-domains'. Only requests for domains in this list will be sent through the tunnel. Overrides '--direct-domains'.

### `tunnelIdentifier`:
Don't automatically assign jobs to this tunnel. Jobs will use it only by explicitly providing the right identifier.

### `verbose`:
Enable verbose logging. Can be used up to two times. (default "true")

## Example usage

uses: actions/sauce-connect
with:
  user: 'my-username'

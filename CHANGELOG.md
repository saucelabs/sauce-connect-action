# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [2.3.6] - 2023-11-01

### Changed
- update to Sauce Connect `v4.9.2`


## [2.3.5] - 2023-05-14

### Changed
- update to Sauce Connect `v4.9.1`

## [2.3.4] - 2023-04-06

### Changed
- update to Sauce Connect `v4.9.0`
- resolves #61

## [2.3.2] - 2023-01-26
### Changed
- Add a custom error message if there is an error on Sauce Connect startup and an error displaying the log file

## [2.3.1] - 2022-12-22

### Changed
- update to Sauce Connect `v4.8.2`
- prevent unhandled promise rejection from startSc
- dependencies updated

## [2.3.0] - 2022-09-26

### Changed
- install the sc proxy using actions/tool-cache
- use actions/setup-node to explicitly install Node.js
- update dependencies

## [2.2.1] - 2022-07-26

### Changed
- update to Sauce Connect `v4.8.1`

## [2.2.0] - 2022-05-11

### Changed
- update to Sauce Connect `v4.8.0`

## [2.1.1] - 2022-01-29

### Changed
- dependencies updated
- adding metadata to SC CLI that would allow SC team to track this github action usage

## [2.1.0] - 2022-01-28

### Changed
- update to Sauce Connect `v4.7.1`
- updated README
- updated options to match SC `v4.7.1` CLI
- fixed `configFile` option support

## [1.1.3] - 2021-03-11

### Changed
- Add error message if Sauce Connect can't be started
- update to Sauce Connect `v4.6.4`

[1.1.3]: https://github.com/saucelabs/sauce-connect-action/compare/1.1.2...1.1.3

## [1.1.1] - 2020-09-08

### Added
- n/a

### Changed
- Fix argument handling (#9)

### Removed
- n/a

[1.0.0]: https://github.com/saucelabs/sauce-connect-action/compare/1.1.0...1.1.1

## [1.1.0] - 2020-09-07

### Added
- Support for Sauce Connect v4.6.2

### Changed
- Run `saucelabs/sauce-connect` image via DinD

### Removed
- Ability to set `-f` or `--readyfile` parameter as it was not useful anyway

[1.0.0]: https://github.com/saucelabs/sauce-connect-action/compare/1.0.0...1.1.0

## [1.0.0] - 2019-09-25

### Added
- n/a

### Changed
- Initial release

### Removed
- n/a

[1.0.0]: https://github.com/saucelabs/sauce-connect-action/compare/1.0.0...1.0.0

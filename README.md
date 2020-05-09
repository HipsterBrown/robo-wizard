# Robo-Wizard

A library for building multi-step forms backed by a state machine using [robot](https://thisrobot.life).

*TODO:*
- [X] support conditional step progression with `when` guard function
- [X] add GitHub Actions CI for tests + linting
- [X] update `onChange` to pass object of values and functions to handler
- [X] update `onChange` handler arguments with `goToNextStep` and `goToPreviousStep` helper functions
- [X] augement result of createWizard to be object / class to be passed into OnChangeHandler
- [X] add example of usage of HTML + JS
- [ ] add example of JS framework integration
- [ ] generate typedoc site, deploy to gh-pages
- [ ] use semantic-release to auto-publish 1.0

## Examples

Check out the [examples](./examples/) directory to see a sample of usage.

## Local Development

This project was bootstrapped with [TSDX](https://github.com/jaredpalmer/tsdx).

Below is a list of commands you will probably find useful.

### `npm start` or `yarn start`

Runs the project in development/watch mode. Your project will be rebuilt upon changes. TSDX has a special logger for you convenience. Error messages are pretty printed and formatted for compatibility VS Code's Problems tab.

<img src="https://user-images.githubusercontent.com/4060187/52168303-574d3a00-26f6-11e9-9f3b-71dbec9ebfcb.gif" width="600" />

Your library will be rebuilt if you make edits.

### `npm run build` or `yarn build`

Bundles the package to the `dist` folder.
The package is optimized and bundled with Rollup into multiple formats (CommonJS, UMD, and ES Module).

<img src="https://user-images.githubusercontent.com/4060187/52168322-a98e5b00-26f6-11e9-8cf6-222d716b75ef.gif" width="600" />

### `npm test` or `yarn test`

Runs the test watcher (Jest) in an interactive mode.
By default, runs tests related to files changed since the last commit.

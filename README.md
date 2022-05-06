# Robo Wizard

![](./docs/static/img/robo-wizard.png)

Robo Wizard is a library and collection of packages for building multi-step workflows backed by a state machine using [@xstate/fsm](https://xstate.js.org/docs/packages/xstate-fsm/).

👀 [Read the docs to find out more](http://robo-wizard.js.org)

Check out the [examples](https://github.com/HipsterBrown/robo-wizard/tree/main/examples) directory to see a sample of usage with HTML and a few framework integrations.

## Local Development

This project is built with [Vite](https://vitejs.dev/) and uses [pnpm](https://pnpm.io/) for package management.

Below is a list of commands you will probably find useful.

### `pnpm start`

Runs the project in development/watch mode. Your project will be rebuilt upon changes.

### `pnpm run build`

Bundles the package to the `dist` folder.
The package is optimized and bundled with Rollup into multiple formats (UMD and ES Module).

### `pnpm test`

Runs the test watcher (Vitest) in an interactive mode.
By default, runs tests related to files changed since the last commit.

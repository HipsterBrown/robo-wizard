# Robo-Wizard

A library for building multi-step forms backed by a state machine using [@xstate/fsm](https://xstate.js.org/docs/packages/xstate-fsm/).

**Installation**

This package is written in TypeScript so type definitions are included by default:

```
npm install robo-wizard
```

```
pnpm install robo-wizard
```

```
yarn add robo-wizard
```

**Basic usage:**

```typescript
import { createWizard } from 'robo-wizard';

const wizard = createWizard(['first', 'second', 'third']);
wizard.start(updatedWizard => { console.log('Updated!', updatedWizard.currentStep) });

console.log(wizard.currentStep); // first

wizard.goToNextStep();

console.log(wizard.currentStep); // second

wizard.goToNextStep();

console.log(wizard.currentStep); // third

wizard.goToPreviousStep();

console.log(wizard.currentStep); // second
```

**Gathering values:**

```typescript
import { createWizard } from 'robo-wizard';

const wizard = createWizard(['first', 'second', 'third'], { firstName: '', lastName: '' });
wizard.start(updatedWizard => { console.log('Updated!', updatedWizard.currentStep), updatedWizard.currentValues });

console.log(wizard.currentValues); // { firstName: '', lastName: '' }

wizard.goToNextStep({ values: { firstName: 'Jane' } });

console.log(wizard.currentValues); // { firstName: 'Jane', lastName: '' }

wizard.goToNextStep({ values: { lastName: 'Doe' } });

console.log(wizard.currentValues); // { firstName: 'Jane', lastName: 'Doe' }

wizard.goToPreviousStep({ values: { firstName: '', lastName: '' } });

console.log(wizard.currentValues); // { firstName: '', lastName: '' }
```

## Examples

Check out the [examples](./examples/) directory to see a sample of usage with HTML and a few framework integrations.

## Work In Progress Roadmap

- [ ] `createForm` state machine generator to control form state for a step in the wizard
- [ ] example integration of routed wizard steps, i.e. using `react-router` or `history` packages
- [ ] add history stack to internal state machine to lookup the previous step when using custom progression

## Local Development

This project was bootstrapped with [TSDX](https://github.com/jaredpalmer/tsdx) and uses [pnpm](https://pnpm.io/) for package management.

Below is a list of commands you will probably find useful.

### `pnpm start`

Runs the project in development/watch mode. Your project will be rebuilt upon changes. TSDX has a special logger for you convenience. Error messages are pretty printed and formatted for compatibility VS Code's Problems tab.

<img src="https://user-images.githubusercontent.com/4060187/52168303-574d3a00-26f6-11e9-9f3b-71dbec9ebfcb.gif" width="600" />

Your library will be rebuilt if you make edits.

### `pnpm run build`

Bundles the package to the `dist` folder.
The package is optimized and bundled with Rollup into multiple formats (CommonJS, UMD, and ES Module).

<img src="https://user-images.githubusercontent.com/4060187/52168322-a98e5b00-26f6-11e9-8cf6-222d716b75ef.gif" width="600" />

### `pnpm test`

Runs the test watcher (Jest) in an interactive mode.
By default, runs tests related to files changed since the last commit.

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

**Navigation**

In order to act as a good web citizen, robo-wizard provides a way to integrate with client-side routing APIs for steps that map to real URL paths.

```typescript
import { createWizard } from 'robo-wizard';

const wizard = createWizard(
  ['first', 'second', 'third'],
  { firstName: '', lastName: '' }
  {
    navigate: () => history.pushState({}, '', `/${wizard.currentStep}`)
  }
);

window.addEventListener('popstate', () => {
  const stepFromPath = window.location.pathname.split('/').pop();
  if (stepFromPath && stepFromPath !== wizard.currentStep) wizard.sync({ step: stepFromPath })
})

wizard.start(updatedWizard => { console.log('Updated!', updatedWizard.currentStep), updatedWizard.currentValues });

console.log(wizard.currentValues); // { firstName: '', lastName: '' }

wizard.goToNextStep({ values: { firstName: 'Jane' } });

console.log(wizard.currentValues); // { firstName: 'Jane', lastName: '' }

wizard.goToNextStep({ values: { lastName: 'Doe' } });

console.log(wizard.currentValues); // { firstName: 'Jane', lastName: 'Doe' }

wizard.goToPreviousStep({ values: { firstName: '', lastName: '' } });

console.log(wizard.currentValues); // { firstName: '', lastName: '' }
```

While the above example demonstrates using the [History API](http://developer.mozilla.org/en-US/docs/Web/API/History_API), see the examples directory for how the [`history`](https://www.npmjs.com/package/history) and [`react-router`](https://www.npmjs.com/package/react-router) packages can be integrated.

## Examples

Check out the [examples](./examples/) directory to see a sample of usage with HTML and a few framework integrations.

## Work In Progress Roadmap

- [ ] `createForm` state machine generator to control form state for a step in the wizard
- [X] example integration of routed wizard steps, i.e. using `react-router` or `history` packages
- [ ] add history stack to internal state machine to lookup the previous step when using custom progression

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

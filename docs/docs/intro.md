---
sidebar_position: 1
---

# Overview

Robo Wizard is a library and collection of packages for building multi-step workflows backed by a state machine using [@xstate/fsm](https://xstate.js.org/docs/packages/xstate-fsm/).

## Installation

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

## Usage

### Basics

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

### Gathering Values

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

### Navigation

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

Check out the [examples](https://github.com/HipsterBrown/robo-wizard/tree/main/examples) directory to see a sample of usage with HTML and a few framework integrations.

---
slug: welcome-back
title: Welcome (Back)
authors: [hipsterbrown]
tags: [intro]
---

It's been a little over 2 years since the version 1.0.0 release of `robo-wizard`:

<blockquote class="twitter-tweet" data-conversation="none" data-dnt="true"><p lang="en" dir="ltr">Related to this, I published v1.0.0 of a new project called robo-wizard, a library for building multi-step forms backed by a state machine. 🤖🧙‍♂️<br/><br/>👏 Shoutout to <a href="https://twitter.com/matthewcp?ref_src=twsrc%5Etfw">@matthewcp</a> for robot3, which makes this all possible.<a href="https://t.co/7kujZPy0uj">https://t.co/7kujZPy0uj</a></p>&mdash; Nick Hehr (@hipsterbrown) <a href="https://twitter.com/hipsterbrown/status/1259894454829416449?ref_src=twsrc%5Etfw">May 11, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Quite a bit has changed since that original announcement, although the focus of the library has remained the same.

While I'm still grateful to [robot3](https://thisrobot.life/) for inspiring the minimal API and creating a smooth on-ramp to learning about state machines in UI development, that dependency has been replaced by [`@xstate/fsm`](https://xstate.js.org/docs/packages/xstate-fsm/). XState FSM also provides a minimal API to power the internal logic of `robo-wizard`, with consistent updates and dedicated team behind it. This refactor was purely internal and did not affect the public API of the package.

Another advantage of adopting XState is the ability to fire "entry" actions that can be configured as options when creating the machine, separate from the schema. This feature lead to the `createWizard` function from `robo-wizard` accepting its first action parameter for navigating [routed steps](https://github.com/HipsterBrown/robo-wizard/pull/17). 

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
  if (stepFromPath !== wizard.currentStep) {
    wizard.sync({ step: stepFromPath })
  }
})
```

---

While these updates are exciting enough for a single blog post, there's _one more thing_.

The core `robo-wizard` package is no longer alone in the [repo](https://github.com/HipsterBrown/robo-wizard); the first official framework integration packages have been published: [`@robo-wizard/react`](/docs/api/modules/robo_wizard_react) & [`@robo-wizard/react-router`](/docs/api/modules/robo_wizard_react_router)

These packages make getting started with Robo Wizard and React much easier than before, while the [other framework examples still exist](https://github.com/HipsterBrown/robo-wizard/tree/main/examples) until more demand motivates their own official integrations. The repo is now in a better place to support adding more packages through the help of [pnpm workspaces](https://pnpm.io/workspaces). 

It feels good to get this project started again. There's plenty of work ahead; from documentation and educational content to feature development to expand the functionality to as many environments as possible. If any of this sounds interesting to you, please drop a line on [Twitter](https://twitter.com/hipsterbrown) or start a [discussion](https://github.com/HipsterBrown/robo-wizard/discussions) in the project repo.

Cheers and thanks for making the web a bit more magical!

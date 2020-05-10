import {
  createMachine,
  transition,
  guard,
  reduce,
  interpret,
  state,
  Transition,
  Guard,
  Action,
  Reducer,
  Machine,
  MachineState,
  Service,
} from 'robot3';

/** Base type describing an object of string keys and `any` value */
export type BaseValues = {
  [key: string]: any;
};

/**
 * @typeParam Values Generic type for object of values being gathered through the wizard steps
 *
 * A string is a shorthand for an always true conditional guard, i.e. `['nextStep', when(() => true)]`
 * The array version should be a tuple with the string name of a step, paired with a guard, like [[when]]:
 *
 * ```typescript
 * [
 *   ['conditionalStep', when((currentValues, { values }) => values.showConditional === true)],
 *   'fallbackStep'
 * ] // StepTransition[]
 * ```
 */
export type StepTransition<Values = BaseValues> =
  | string
  | Array<string | Guard<Values> | Reducer<Values> | Action<Values>>;

/**
 * @typeParam Values Generic type for object of values being gathered through the wizard steps
 */
export type StepConfig<Values = BaseValues> = {
  /** Name of the step */
  name: string;
  /**
   * Name of the next step in progression after calling [[goToNextStep]].
   * Passing `false` will prevent the wizard from progressing forward at this step.
   * Passing a [[StepTransition]] array allows for conditional progression using the [[`when`]] helper.
   */
  next?: string | StepTransition<Values>[] | boolean;
  /**
   * Name of the previous step in progression after calling [[goToPreviousStep]].
   * Passing `false` will prevent the wizard from progressing backwards at this step.
   * Passing a [[StepTransition]] array allows for conditional progression using the [[`when`]] helper.
   */
  previous?: string | StepTransition<Values>[] | boolean;
};

/**
 * @typeParam Values Generic type for object of values being gathered through the wizard steps
 *
 * A step in the wizard can be described as a string for default progression, or an object for custom progression, see [[StepConfig]] for more details
 */
export type FlowStep<Values = BaseValues> = string | StepConfig<Values>;

/**
 * @typeParam StepMachine Generic type for the configured state machine, based on [[Machine]] from [robot](https://thisrobot.life)
 * @typeParam Values Generic type for object of values being gathered through the wizard steps
 * @param wizard The [[RoboWizard]] instance that has just been updated
 *
 * An event handler for reacting when the wizard updates, i.e. after step progression or values have been updated
 */
type ChangeHandler<StepMachine extends Machine, Values = BaseValues> = (
  wizard: RoboWizard<StepMachine, Values>
) => void;

/**
 * @typeParam StepMachine Generic type for the configured state machine, based on the `Machine` type from [robot](https://thisrobot.life)
 * @typeParam Values Generic type for object of values being gathered through the wizard steps
 *
 * This class is the return value from [[createWizard]] and the only way to be instantiated.
 */
class RoboWizard<StepMachine extends Machine, Values = BaseValues> {
  /** @ignore */
  private _service?: Service<StepMachine>;

  /** @ignore */
  constructor(private machine: StepMachine) {}

  /**
   * @param onChange [[ChangeHandler]] for reacting when the wizard updates, this will be called immediately
   * @param values Optional object of initial values to use when creating the wizard
   *
   * This should be called before trying to access any other methods or properties, otherwise an Error will be thrown
   */
  public start(onChange: ChangeHandler<StepMachine, Values>, values?: Values) {
    if (this._service) return;
    this._service = interpret<StepMachine, 'next' | 'previous'>(
      this.machine,
      () => {
        onChange(this);
      },
      values || this.machine.context
    );
    onChange(this);
  }

  /**
   * Returns the current step of the wizard
   */
  get currentStep() {
    return this.service.machine.current;
  }

  /**
   * Returns the current state of values been gathered through the wizard
   */
  get currentValues() {
    return this.service.context;
  }

  /**
   * @param event Optional object with a `values` field to described what Values should be updated, see [[UpdateEvent]]
   * Progress to the next step in the wizard
   */
  public goToNextStep(event: Partial<UpdateEvent<Values>> = {}) {
    this.service.send({ type: 'next', ...event });
  }

  /**
   * @param event Optional object with a `values` field to described what Values should be updated, see [[UpdateEvent]]
   * Progress to the previous step in the wizard
   */
  public goToPreviousStep(event: Partial<UpdateEvent<Values>> = {}) {
    this.service.send({ type: 'previous', ...event });
  }

  /** @ignore */
  private get service() {
    if (typeof this._service === 'undefined') {
      throw new Error(
        'Please call "start" before any other method or property.'
      );
    }
    return this._service;
  }
}

/**
 * @typeParam Values Generic type for object of values being gathered through the wizard steps
 * @param steps Configuration of steps for the wizard, see [[FlowStep]]
 * @param initialValues Optional object with intial values to use when starting the wizard
 *
 * Basic usage:
 * ```typescript
 * import { createWizard } from 'robo-wizard';
 *
 * const wizard = createWizard(['first', 'second', 'third']);
 * wizard.start(updatedWizard => { console.log('Updated!', updatedWizard.currentStep) });
 *
 * console.log(wizard.currentStep); // first
 *
 * wizard.goToNextStep();
 *
 * console.log(wizard.currentStep); // second
 *
 * wizard.goToNextStep();
 *
 * console.log(wizard.currentStep); // third
 *
 * wizard.goToPreviousStep();
 *
 * console.log(wizard.currentStep); // second
 * ```
 *
 * Gathering values:
 * ```typescript
 * import { createWizard } from 'robo-wizard';
 *
 * const wizard = createWizard(['first', 'second', 'third'], { firstName: '', lastName: '' });
 * wizard.start(updatedWizard => { console.log('Updated!', updatedWizard.currentStep), updatedWizard.currentValues });
 *
 * console.log(wizard.currentValues); // { firstName: '', lastName: '' }
 *;
 * wizard.goToNextStep({ values: { firstName: 'Jane' } });
 *
 * console.log(wizard.currentValues); // { firstName: 'Jane', lastName: '' }
 *
 * wizard.goToNextStep({ values: { lastName: 'Doe' } });
 *
 * console.log(wizard.currentValues); // { firstName: 'Jane', lastName: 'Doe' }
 *
 * wizard.goToPreviousStep({ values: { firstName: '', lastName: '' } });
 *
 * console.log(wizard.currentValues); // { firstName: '', lastName: '' }
 * ```
 *
 * By default, the wizard will progress linearly in the order of array passed to `createWizard`. That behavior can be overriden by passing an [[StepConfig]] to in place of the string step name:
 * ```typescript
 * import { createWizard } from 'robo-wizard';
 *
 * const wizard = createWizard([
 *   { name: 'first', next: 'third' }, 'skipped', {name: 'third', previous: 'first'}
 * ]);
 * wizard.start(updatedWizard => { console.log('Updated!', updatedWizard.currentStep) });
 *
 * console.log(wizard.currentStep); // first
 *;
 * wizard.goToNextStep();
 *
 * console.log(wizard.currentStep); // third
 *
 * wizard.goToPreviousStep();
 *
 * console.log(wizard.currentStep); // first
 * ```
 *
 * Progression can be conditional using the [[when]] helper:
 * ```typescript
 * import { createWizard, when } from 'robo-wizard';
 *
 * const wizard = createWizard([
 *   { name: 'first', next: [['third', when((currentValues, { values }) => values.goToThird )], 'second'] },
 *   'second',
 *   {name: 'third', previous: 'first'}
 * ], { goToThird: false });
 * wizard.start(updatedWizard => { console.log('Updated!', updatedWizard.currentStep) });
 *
 * console.log(wizard.currentStep); // first
 *;
 * wizard.goToNextStep({ values: { goToThird: true } });
 *
 * console.log(wizard.currentStep); // third
 *
 * wizard.goToPreviousStep({ values: { goToThird: false } });
 *
 * console.log(wizard.currentStep); // first
 *
 * wizard.goToNextStep();
 *
 * console.log(wizard.currentStep); // second
 *
 * wizard.goToNextStep();
 *
 * console.log(wizard.currentStep); // third
 * ```
 */
export function createWizard<Values = BaseValues>(
  steps: FlowStep<Values>[],
  initialValues: Values = {} as Values
) {
  const normalizedSteps: StepConfig<Values>[] = steps.map(step =>
    typeof step === 'string' ? { name: step } : step
  );

  const stepConfig = Object.freeze(
    normalizedSteps.reduce<{
      [step: string]: MachineState;
    }>((config, step, index) => {
      const transitions: Transition[] = [];

      if (step.previous && typeof step.previous === 'string') {
        transitions.push(transition('previous', step.previous));
      } else if (
        step.previous !== false &&
        step.name !== normalizedSteps[0].name
      ) {
        transitions.push(
          transition('previous', normalizedSteps[index - 1].name)
        );
      }

      if (step.next) {
        if (typeof step.next === 'string') {
          transitions.push(
            transition('next', step.next, updateValues<Values>())
          );
        } else if (Array.isArray(step.next)) {
          transitions.push(
            ...step.next.map(nextStep => {
              const [stepName, ...guardsOrReducers] =
                typeof nextStep === 'string' ? [nextStep] : nextStep;
              return transition(
                'next',
                stepName as string,
                ...(guardsOrReducers as Array<
                  Guard<Values> | Reducer<Values> | Action<Values>
                >),
                updateValues<Values>()
              );
            })
          );
        }
      } else if (
        step.next !== false &&
        step.name !== normalizedSteps[steps.length - 1].name
      ) {
        transitions.push(
          transition(
            'next',
            normalizedSteps[index + 1].name,
            updateValues<Values>()
          )
        );
      }

      return {
        ...config,
        [step.name]: state(...transitions),
      };
    }, {})
  );
  const machine = createMachine(stepConfig, () => initialValues) as Machine<
    typeof stepConfig,
    Values,
    string
  >;

  return new RoboWizard<typeof machine, Values>(machine);
}

/**
 * Event object containing any new values to be updated
 */
type UpdateEvent<Values> = { values: Values };

/**
 * @internal
 */
function updateValues<Values = BaseValues>() {
  return reduce<Values>((currentValues, event) => {
    const newValues = (event as UpdateEvent<Values>).values || {};
    return {
      ...currentValues,
      ...newValues,
    };
  });
}

/**
 * @typeParam Values Generic type for object of values being gathered through the wizard steps
 * @param values Current state of values gathered through the wizard
 * @param event Event object containing any new values to be updated, see [[UpdateEvent]]
 */
export type WhenFunction<Values = BaseValues> = (
  values: Values,
  event: UpdateEvent<Values>
) => boolean;

/**
 * @typeParam Values Generic type for object of values being gathered through the wizard steps
 * @param fn Guard function to be called to test if the step should transition, see [[WhenFunction]]
 * See [[createWizard]] for example usage
 */
export function when<Values = BaseValues>(fn: WhenFunction<Values>) {
  return guard<Values>((context, event) =>
    fn(context, event as UpdateEvent<Values>)
  );
}

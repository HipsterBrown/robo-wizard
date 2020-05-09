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

export type BaseValues = {
  [key: string]: any;
};

export type StepTransition<Values = BaseValues> =
  | string
  | Array<string | Guard<Values> | Reducer<Values> | Action<Values>>;
export type StepConfig<Values = BaseValues> = {
  name: string;
  next?: string | StepTransition<Values>[] | boolean;
  previous?: string | StepTransition<Values>[] | boolean;
};

export type FlowStep<Values = BaseValues> = string | StepConfig<Values>;

type ChangeHandler<StepMachine extends Machine, Values = BaseValues> = (
  wizard: RoboWizard<StepMachine, Values>
) => void;

class RoboWizard<StepMachine extends Machine, Values = BaseValues> {
  private _service?: Service<StepMachine>;

  constructor(private machine: StepMachine) {}

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

  get currentStep() {
    return this.service.machine.current;
  }

  get currentValues() {
    return this.service.context;
  }

  public goToNextStep(event: Partial<UpdateEvent<Values>> = {}) {
    this.service.send({ type: 'next', ...event });
  }

  public goToPreviousStep(event: Partial<UpdateEvent<Values>> = {}) {
    this.service.send({ type: 'previous', ...event });
  }

  private get service() {
    if (typeof this._service === 'undefined') {
      throw new Error(
        'Please call "start" before any other method or property.'
      );
    }
    return this._service;
  }
}

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

type UpdateEvent<Values> = { values: Values };

function updateValues<Values = BaseValues>() {
  return reduce<Values>((currentValues, event) => {
    const newValues = (event as UpdateEvent<Values>).values || {};
    return {
      ...currentValues,
      ...newValues,
    };
  });
}

export type WhenFunction<Values = BaseValues> = (
  values: Values,
  event: UpdateEvent<Values>
) => boolean;

export function when<Values = BaseValues>(fn: WhenFunction<Values>) {
  return guard<Values>((context, event) =>
    fn(context, event as UpdateEvent<Values>)
  );
}

import {
  createMachine,
  transition,
  reduce,
  interpret,
  state,
  Transition,
  SendFunction,
  GuardFunction,
  ActionFunction,
  ReduceFunction,
  Machine,
  MachineState,
} from 'robot3';

export type BaseValues = {
  [key: string]: any;
};

type StepTransition<Values = BaseValues> =
  | string
  | Array<
      | string
      | GuardFunction<Values>
      | ReduceFunction<Values>
      | ActionFunction<Values>
    >;
type StepConfig<Values = BaseValues> = {
  name: string;
  next?: string | StepTransition<Values>[] | boolean;
  previous?: string | StepTransition<Values>[] | boolean;
};
type FlowStep<Values = BaseValues> = string | StepConfig<Values>;

export type ChangeHandler<Values = BaseValues> = (
  currentStep: string,
  currentValues: Values,
  send: SendFunction
) => void;

export function createFlow<Values = BaseValues>(
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

      if (step.next && typeof step.next === 'string') {
        transitions.push(transition('next', step.next, updateValues<Values>()));
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

  return {
    start(onChange: ChangeHandler<Values>, values?: Values) {
      const service = interpret<typeof machine, 'next' | 'previous'>(
        machine,
        ({ machine: { current }, context, send }) => {
          onChange(current, context, send);
        },
        values || initialValues
      );
      onChange(service.machine.current, service.context, service.send);
    },
  };
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

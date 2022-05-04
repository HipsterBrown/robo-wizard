import { useReducer, useState } from "react";
import { createWizard, FlowStep, BaseValues } from "robo-wizard";

/**
 * @typeParam Values Generic type for object of values being gathered through the wizard steps
 * @param steps Configuration of steps for the wizard, see [[FlowStep]]
 * @param initialValues Optional object with intial values to use when starting the wizard
 * @param actions Optional object with navigate field with a function to be called when entering a step
 *
 * Basic usage:
 * ```tsx
 *
 *
 *
 *
 * ````
 * */
export function useWizard<Values extends object = BaseValues>(
  steps: FlowStep<Values>[],
  initialValues: Values = {} as Values,
  actions: Parameters<typeof createWizard>[2] = {}
) {
  const [_, refreshState] = useReducer((s: boolean) => !s, false);
  const [currentWizard] = useState(() => {
    const wizard = createWizard(steps, initialValues, actions);
    wizard.start(refreshState);
    return wizard;
  });
  return currentWizard;
}

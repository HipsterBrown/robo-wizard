import { useState, useReducer } from "react";
import { createWizard, FlowStep, BaseValues } from "robo-wizard";

/**
 * @typeParam Values Generic type for object of values being gathered through the wizard steps
 * @param steps Configuration of steps for the wizard, see [[FlowStep]]
 * @param initialValues Optional object with intial values to use when starting the wizard
 * @param actions Optional object with navigate field with a function to be called when entering a step
 *
 * @example <caption>Basic usage</caption>
 * ```tsx
 *
 *  const App: React.FC = () => {
 *    const wizard = useWizard<Values>(['first', 'second', 'third']);

 *    const onSubmit: React.FormEventHandler<HTMLFormElement> = event => {
 *      event.preventDefault();
 *      const values = Object.fromEntries(new FormData(event.currentTarget))
 *      wizard.goToNextStep({ values });
 *    };

 *    return (
 *      <div>
 *        <p>{wizard.currentStep} step</p>
 *        <form onSubmit={onSubmit}>
 *          {wizard.currentStep === 'first' && (
 *            <div>
 *              <label
 *                htmlFor="firstName"
 *                id="firstName-label"
 *              >
 *                First Name:
 *              </label>
 *              <input
 *                type="text"
 *                name="firstName"
 *                id="firstName"
 *                aria-label="firstName-label"
 *                defaultValue={wizard.currentValues.firstName}
 *              />
 *            </div>
 *          )}

 *          {wizard.currentStep === 'second' && (
 *            <div>
 *              <label
 *                htmlFor="lastName"
 *                id="lastName-label"
 *              >
 *                Last Name:
 *              </label>
 *              <input
 *                type="text"
 *                name="lastName"
 *                id="lastName"
 *                aria-label="lastName-label"
 *                defaultValue={wizard.currentValues.lastName}
 *              />
 *            </div>
 *          )}

 *          {wizard.currentStep === 'third' && (
 *            <div>
 *              <p>
 *                Welcome {wizard.currentValues.firstName}{' '}
 *                {wizard.currentValues.lastName}!
 *              </p>
 *            </div>
 *          )}

 *          <div>
 *            <button
 *              type="button"
 *              role="link"
 *              onClick={() => wizard.goToPreviousStep()}
 *            >
 *              Previous
 *            </button>
 *            <button type="submit">
 *              Next
 *            </button>
 *          </div>
 *        </form>
 *      </div>
 *    );
 *  };
 * ```
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

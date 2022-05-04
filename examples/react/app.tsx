import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createWizard, FlowStep, BaseValues } from 'robo-wizard';

function useWizard<Values extends object = BaseValues>(
  steps: FlowStep<Values>[],
  initialValues: Values = {} as Values
) {
  const [_, refreshState] = React.useState<boolean>(false);
  const [currentWizard] = React.useState(() => {
    const wizard = createWizard<Values>(steps, initialValues);
    wizard.start(() => refreshState(s => !s));
    return wizard;
  });
  return currentWizard;
}

type Values = {
  firstName?: string;
  lastName?: string;
};

const App: React.FC = () => {
  const wizard = useWizard<Values>(['first', 'second', 'third']);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();
    const data = new FormData(event.target as HTMLFormElement);
    const values = {};
    data.forEach((value, field) => {
      values[field] = value;
    });
    wizard.goToNextStep({ values });
  };

  return (
    <div className="px-5">
      <h1 className="text-2xl font-bold">Robo Wizard w/ React</h1>

      <p className="font-semibold mb-8 underline uppercase">
        {wizard.currentStep} step
      </p>

      <form onSubmit={onSubmit} className="mb-4">
        {wizard.currentStep === 'first' && (
          <div className="mb-6">
            <label
              htmlFor="firstName"
              id="firstName-label"
              className="block mb-2"
            >
              First Name:
            </label>
            <input
              className="border-2 border-solid border-gray-600 px-4 py-2"
              type="text"
              name="firstName"
              id="firstName"
              aria-label="firstName-label"
              defaultValue={wizard.currentValues.firstName}
            />
          </div>
        )}

        {wizard.currentStep === 'second' && (
          <div className="mb-6">
            <label
              htmlFor="lastName"
              id="lastName-label"
              className="block mb-2"
            >
              Last Name:
            </label>
            <input
              className="border-2 border-solid border-gray-600 px-4 py-2"
              type="text"
              name="lastName"
              id="lastName"
              aria-label="lastName-label"
              defaultValue={wizard.currentValues.lastName}
            />
          </div>
        )}

        {wizard.currentStep === 'third' && (
          <div className="mb-6">
            <p className="text-green-600">
              Welcome {wizard.currentValues.firstName}{' '}
              {wizard.currentValues.lastName}!
            </p>
          </div>
        )}

        <div className="flex w-32 justify-between">
          <button
            type="button"
            onClick={() => wizard.goToPreviousStep()}
            className="p-3 mr-4"
          >
            Previous
          </button>
          <button type="submit" className="py-3 px-8 border-2 border-gray-900">
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));

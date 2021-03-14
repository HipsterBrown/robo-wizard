import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { createWizard } from '../../src/index';
import { Step, WizardProvider, useWizardContext } from './wizard-context';

const First = () => {
  const wizard = useWizardContext();

  const onSubmit = event => {
    event.preventDefault();
    const data = new FormData(event.target);
    const values = {};
    data.forEach((value, field) => {
      values[field] = value;
    });
    wizard.goToNextStep({ values });
  };

  return (
    <>
      <p className="font-semibold mb-8 underline uppercase">
        {wizard.currentStep} step
      </p>
      <form onSubmit={onSubmit} className="mb-4">
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
    </>
  );
};

const Second = () => {
  const wizard = useWizardContext();

  const onSubmit = event => {
    event.preventDefault();
    const data = new FormData(event.target);
    const values = {};
    data.forEach((value, field) => {
      values[field] = value;
    });
    wizard.goToNextStep({ values });
  };

  return (
    <>
      <p className="font-semibold mb-8 underline uppercase">
        {wizard.currentStep} step
      </p>
      <form onSubmit={onSubmit} className="mb-4">
        <div className="mb-6">
          <label htmlFor="lastName" id="lastName-label" className="block mb-2">
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
    </>
  );
};

const Third = () => {
  const wizard = useWizardContext();

  const onSubmit = event => {
    event.preventDefault();
    const data = new FormData(event.target);
    const values = {};
    data.forEach((value, field) => {
      values[field] = value;
    });
    wizard.goToNextStep({ values });
  };

  return (
    <>
      <p className="font-semibold mb-8 underline uppercase">
        {wizard.currentStep} step
      </p>
      <form onSubmit={onSubmit} className="mb-4">
        <div className="mb-6">
          <p className="text-green-600">
            Welcome {wizard.currentValues.firstName}{' '}
            {wizard.currentValues.lastName}!
          </p>
        </div>
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
    </>
  );
};

const App = () => {
  return (
    <div className="px-5">
      <h1 className="text-2xl font-bold">Robo Wizard</h1>
      <BrowserRouter>
        <WizardProvider initialValues={{ firstName: '', lastName: '' }}>
          <Step name="first" component={First} />
          <Step name="second" component={Second} />
          <Step name="third" component={Third} />
        </WizardProvider>
      </BrowserRouter>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));

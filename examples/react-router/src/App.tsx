import type { FormEvent } from 'react';
import { BrowserRouter } from 'react-router-dom'
import { Step, useWizardContext, WizardProvider } from './wizard-context'

const First = () => {
  const wizard = useWizardContext();

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget))
    wizard.goToNextStep({ values })
  }

  return (
    <>
      <p className="font-semibold mb-8 underline uppercase">
        {wizard.currentStep} step
      </p>
      <form onSubmit={onSubmit} className="mb-4">
        <div className="mb-6">
          <label htmlFor="firstName" id="firstName-label" className="block mb-2">
            First Name:
          </label>
          <input
            className="border-2 border-solid border-gray-600 px-4 py-2"
            type="text"
            name="firstName"
            id="firstName"
            aria-labelledby="firstName-label"
            defaultValue={wizard.currentValues.firstName}
            autoFocus={true}
          />
        </div>
        <div className="flex w-32 justify-between">
          <button type="button" onClick={() => wizard.goToPreviousStep()} className="p-3 mr-4" role="link" >Previous</button>
          <button type="submit" className="py-3 px-8 border-2 border-gray-900">Next</button>
        </div>
      </form>
    </>
  )
}

const Second = () => {
  const wizard = useWizardContext();

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget))
    wizard.goToNextStep({ values })
  }

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
            aria-labelledby="lastName-label"
            defaultValue={wizard.currentValues.lastName}
            autoFocus={true}
          />
        </div>
        <div className="flex w-32 justify-between">
          <button type="button" onClick={() => wizard.goToPreviousStep()} className="p-3 mr-4" role="link" >Previous</button>
          <button type="submit" className="py-3 px-8 border-2 border-gray-900">Next</button>
        </div>
      </form>
    </>
  )
}

const Third = () => {
  const wizard = useWizardContext();

  return (
    <>
      <p className="font-semibold mb-8 underline uppercase">
        {wizard.currentStep} step
      </p>
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
          role="link"
        >
          Previous
        </button>
        <button type="button" role="link" className="py-3 px-8 border-2 border-gray-900">
          Next
        </button>
      </div>
    </>
  );
};

function App() {
  return (
    <div className="px-5">
      <h1 className="text-2xl font-bold">Robo Wizard w/ React-Router</h1>
      <BrowserRouter>
        <WizardProvider initialValues={{ firstName: '', lastName: '' }}>
          <Step name="first" element={<First />} />
          <Step name="second" element={<Second />} />
          <Step name="third" element={<Third />} />
        </WizardProvider>
      </BrowserRouter>
    </div>
  )
}

export default App

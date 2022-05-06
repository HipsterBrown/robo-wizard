# Robo Wizard React

A library for building multi-step workflows in React.

## Getting Started

```
npm i @robo-wizard/react
```

Scaffold a basic wizard experience (bring your own form library as needed):

```tsx
const App: React.FC = () => {
  const wizard = useWizard(['first-name', 'last-name', 'success'], { firstName: '', lastName: '' });

  const onSubmit = event => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget))
    wizard.goToNextStep({ values });
  };

  return (
    <div>
      <p>{wizard.currentStep} step</p>
      <form onSubmit={onSubmit}>
        {wizard.currentStep === 'first-name' && (
          <div>
            <label
              htmlFor="firstName"
              id="firstName-label"
            >
              First Name:
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              aria-label="firstName-label"
              defaultValue={wizard.currentValues.firstName}
            />
          </div>
        )}

        {wizard.currentStep === 'last-name' && (
          <div>
            <label
              htmlFor="lastName"
              id="lastName-label"
            >
              Last Name:
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              aria-label="lastName-label"
              defaultValue={wizard.currentValues.lastName}
            />
          </div>
        )}

        {wizard.currentStep === 'success' && (
          <div>
            <p>
              Welcome {wizard.currentValues.firstName}{' '}
              {wizard.currentValues.lastName}!
            </p>
          </div>
        )}

        <div>
          <button
            type="button"
            role="link"
            onClick={() => wizard.goToPreviousStep()}
          >
            Previous
          </button>
          <button type="submit">
            Next
          </button>
        </div>
      </form>
    </div>
  );
};
```

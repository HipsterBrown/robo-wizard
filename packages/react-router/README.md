# Robo Wizard React-Router

A library for building _routed_, multi-step workflows in React.

## Getting Started

```
npm i @robo-wizard/react-router
```

Scaffold a basic wizard experience:

```tsx
import { BrowserRouter } from 'react-router-dom'
import { Wizard, Step } from '@robo-wizard/react-router'
// import FirstName, LastName, Success from relevant modules

function App() {
 return (
   <BrowserRouter>
     <Wizard initialValues={{ firstName: '', lastName: '' }}>
       <Step name="first-name" element={<FirstName />} />
       <Step name="last-name" element={<LastName />} />
       <Step name="success" element={<Success />} />
     </Wizard>
   </BrowserRouter>
 )
}
```

Create a step that gathers relevant values (bring your own form library as needed):

```tsx
import { useWizardContext } from '@robo-wizard/react-router'

export const FirstName = () => {
  const wizard = useWizardContext();

  const onSubmit = (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget))
    wizard.goToNextStep({ values })
  }

  return (
    <>
      <p>{wizard.currentStep} step</p>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="firstName" id="firstName-label">
            First Name:
          </label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            aria-labelledby="firstName-label"
            defaultValue={wizard.currentValues.firstName}
            autoFocus={true}
          />
        </div>
        <div>
          <button type="button" onClick={() => wizard.goToPreviousStep()} role="link">Previous</button>
          <button type="submit">Next</button>
        </div>
      </form>
    </>
  )
}
```

Go forth and make the web a bit more magical! ✨

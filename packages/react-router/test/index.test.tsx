import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, useNavigate } from 'react-router'
import { Wizard, Step, useWizardContext } from '../src'

function TestStep() {
  const wizard = useWizardContext()
  const navigate = useNavigate()

  return (
    <>
      <h1>{wizard.currentStep} step</h1>
      <button type="button" onClick={() => navigate(-1)}>Back</button>
      <button type="button" onClick={() => wizard.goToNextStep()}>Next</button>
    </>
  )
}

describe('Wizard', () => {
  const subject = () => (
    <MemoryRouter>
      <Wizard>
        <Step name="first" element={<TestStep />} />
        <Step name="second" element={<TestStep />} />
        <Step name="third" element={<TestStep />} />
      </Wizard>
    </MemoryRouter>
  )

  it('navigates through steps', () => {
    render(subject());

    expect(screen.getByText('first step')).toBeTruthy();

    fireEvent.click(screen.getByText('Next'))

    expect(screen.getByText('second step')).toBeTruthy();

    fireEvent.click(screen.getByText('Next'))

    expect(screen.getByText('third step')).toBeTruthy();

    fireEvent.click(screen.getByText('Back'))

    expect(screen.getByText('second step')).toBeTruthy();
  })
})

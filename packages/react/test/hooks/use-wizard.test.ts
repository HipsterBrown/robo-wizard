import { describe, it, expect } from 'vitest'
import { act, renderHook } from '@testing-library/react-hooks'
import { useWizard } from '../../src/hooks/use-wizard'

describe('useWizard', () => {
  let steps = ['first', 'second', 'third']
  let initialValues: { test?: string } = {}

  const subject = () => useWizard(steps, initialValues)

  it('should progress through the steps', () => {
    const { result } = renderHook(subject)

    expect(result.current.currentStep).toBe('first')

    act(() => {
      result.current.goToNextStep()
    })

    expect(result.current.currentStep).toBe('second')
  })

  it('should gather values', () => {
    const { result } = renderHook(subject)

    expect(result.current.currentValues).toMatchObject({})

    act(() => {
      result.current.goToNextStep({ values: { test: 'values' } })
    })

    expect(result.current.currentValues).toMatchObject({ test: 'values' })
  })
})

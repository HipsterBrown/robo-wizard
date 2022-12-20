import { Children, createContext, Fragment, isValidElement, PropsWithChildren, ReactNode, useContext } from "react";
import type { RoboWizard, StepConfig } from "robo-wizard";
import { useWizard } from "../hooks";

/**
 * @param props - accepts same props to match [[StepConfig]] for [[useWizard]], as well as the `element` to display
 **/
export function Step(_props: StepConfig & { element: ReactNode | null }): React.ReactElement | null {
  return null;
}

/**
 * @param steps = The Children opaque object passed to components, only Step components will be processed
 **/
export function createStepsFromChildren(steps: ReactNode): Array<StepConfig & { element: ReactNode }> {
  return Children.map(steps, element => {
    if (isValidElement(element) === false) return;
    if (!element) return;
    if (typeof element === 'object' && 'type' in element) {
      if (element.type === Fragment) {
        return createStepsFromChildren(element.props.children);
      }
      if (element.type === Step) {
        return {
          name: element.props.name,
          next: element.props.next,
          previous: element.props.previous,
          element: element.props.element,
        }
      }
    }
    return;
  })?.flat().filter(Boolean) ?? [];
}

/**
 * @internal
 **/
export const WizardContext = createContext<null | RoboWizard>(null);

export type WizardProviderProps<Values extends Record<string, unknown>> = PropsWithChildren<{
  initialValues?: Values;
}>

/**
 * @typeParam Values Optional object to describe values being gathered by the wizard
 * @param props
 *
 * Create a wizard experience
 *
 * 
 * @example <caption>Set up the Wizard with Step components</caption>
 * ```tsx
 * function App() {
 *   return (
 *     <Wizard<Values> initialValues={{ firstName: '', lastName: '' }}>
 *       <Step name="first" element={<First />} />
 *       <Step name="second" element={<Second />} />
 *       <Step name="third" element={<Third />} />
 *     </Wizard>
 *   )
 * }
 * ```
 *
 * 
 * @example <caption>An example step component</caption>
 * ```tsx
 * const First = () => {
 *   const wizard = useWizardContext<Values>();
 * 
 *   const onSubmit = (event: FormEvent<HTMLFormElement>) => {
 *     event.preventDefault();
 *     const values = Object.fromEntries(new FormData(event.currentTarget))
 *     wizard.goToNextStep({ values })
 *   }
 * 
 *   return (
 *     <>
 *       <p>{wizard.currentStep} step</p>
 *       <form onSubmit={onSubmit}>
 *         <div>
 *           <label htmlFor="firstName" id="firstName-label">
 *             First Name:
 *           </label>
 *           <input
 *             type="text"
 *             name="firstName"
 *             id="firstName"
 *             aria-labelledby="firstName-label"
 *             defaultValue={wizard.currentValues.firstName}
 *             autoFocus={true}
 *           />
 *         </div>
 *         <div>
 *           <button type="button" onClick={() => wizard.goToPreviousStep()} role="link">Previous</button>
 *           <button type="submit">Next</button>
 *         </div>
 *       </form>
 *     </>
 *   )
 * }
 * ```
 **/
export function Wizard<Values extends Record<string, unknown>>({ children, initialValues = {} as Values }: WizardProviderProps<Values>) {
  const steps = createStepsFromChildren(children);
  const wizard = useWizard<Values>(steps, initialValues)
  const step = steps.find(({ name }) => name === wizard.currentStep)

  return (
    <WizardContext.Provider value={Object.create(wizard)}>
      {step?.element}
    </WizardContext.Provider>
  )
}

/**
 * @typeParam Values - object describing the [[currentValues]] gathered by [[RoboWizard]]
 * 
 * Access the [[RoboWizard]] from the [[Wizard]] Context Provider 
 **/
export function useWizardContext<Values extends object>() {
  const wizard = useContext(WizardContext);
  if (wizard === null) throw new Error('useWizardContext must be used within WizardProvider')
  return wizard as RoboWizard<Values>;
}

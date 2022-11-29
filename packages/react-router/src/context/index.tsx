import { Children, createContext, useContext, useEffect, PropsWithChildren, ReactNode, ReactElement } from 'react';
import { useNavigate, useRoutes, Navigate, useLocation, RouteObject } from 'react-router';
import type { RoboWizard, BaseValues, StepConfig } from 'robo-wizard'
import { useWizard } from '@robo-wizard/react'
import { Step } from '../components'

const WizardContext = createContext<null | RoboWizard>(null);

export type WizardProviderProps<Values extends object> = PropsWithChildren<{
  initialValues?: Values;
}>

function isReactElement(child: ReactNode): child is ReactElement {
  return typeof child === 'object' && child !== null && 'type' in child;
}

/**
 * @typeParam Values Optional object to describe values being gathered by the wizard
 * @param props
 *
 * Create a routed wizard experience under a Router from [react-router](https://reactrouter.com)
 *
 * 
 * @example <caption>Set up the Wizard under a BrowserRouter</caption>
 * ```tsx
 * function App() {
 *   return (
 *     <BrowserRouter>
 *       <Wizard<Values> initialValues={{ firstName: '', lastName: '' }}>
 *         <Step name="first" element={<First />} />
 *         <Step name="second" element={<Second />} />
 *         <Step name="third" element={<Third />} />
 *       </Wizard>
 *     </BrowserRouter>
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
export function Wizard<Values extends object = BaseValues>({ children, initialValues = {} as Values }: WizardProviderProps<Values>) {
  if (typeof children !== 'object' || children === null) throw new Error('WizardProvider must have at least one child Step component')

  const steps: Array<StepConfig<Values> & RouteObject> = Children.map(children, child => {
    if (isReactElement(child) && child.type === Step) {
      return { ...child.props as StepConfig<Values>, path: child.props.name as string };
    }
    return null;
  })?.filter(Boolean) ?? [];
  const navigate = useNavigate();
  const location = useLocation();
  const wizard = useWizard(steps, initialValues, {
    navigate: () => {
      navigate(wizard.currentStep);
    }
  });
  const stepsWithRedirect = steps.concat({
    index: true,
    element: (<Navigate to={String(steps[0]?.name)} replace={true} />),
    path: "/",
    name: 'index-redirect'
  });
  const step = useRoutes(stepsWithRedirect)
  const stepFromLocation = location.pathname.split('/').pop();

  useEffect(() => {
    if (stepFromLocation && stepFromLocation !== wizard.currentStep) {
      wizard.sync({ step: stepFromLocation })
    }
  }, [stepFromLocation, wizard])

  return (
    <WizardContext.Provider value={Object.create(wizard)}>
      {step}
    </WizardContext.Provider>
  )
}

/**
 * @typeParam Values - object describing the [[currentValues]] gathered by [[RoboWizard]]
 * 
 * Access the [[RoboWizard]] from the [[Wizard]] Context Provider 
 **/
export function useWizardContext<Values extends object = BaseValues>() {
  const wizard = useContext(WizardContext);
  if (wizard === null) throw new Error('useWizardContext must be used within WizardProvider')
  return wizard as RoboWizard<Values>;
}

import { Children, createContext, useContext, useReducer, useState, useEffect } from 'react';
import { Route, Routes, useNavigate, useRoutes, Navigate, RouteProps, useLocation } from 'react-router';
import { createWizard } from 'robo-wizard'

const WizardContext = createContext<null | ReturnType<typeof createWizard>>(null);

export function Step({ name, ...routeProps }: Exclude<RouteProps, 'path'> & { name: string }) {
  return <Route path={name} {...routeProps} />;
}

export function WizardProvider({ children, initialValues }) {
  const steps = Children.map(children, child => {
    if (child.type === Step) return { ...child.props, path: child.props.name };
    return null;
  }).filter(Boolean);
  const wizard = useWizard(steps, initialValues);
  const step = useRoutes(steps)

  return (
    <WizardContext.Provider value={wizard}>
      {step}
      <Routes>
        <Route index={true} element={<Navigate to={String(steps[0].name)} replace={true} />} />
      </Routes>
    </WizardContext.Provider>
  )
}

export function useWizardContext() {
  const wizard = useContext(WizardContext);
  if (wizard === null) throw new Error('useWizardContext must be used within WizardProvider')
  return wizard;
}

function useWizard(steps, initialValues) {
  const navigate = useNavigate();
  const [_, refreshState] = useReducer(s => !s, false);
  const [currentWizard] = useState(() => {
    const wizard = createWizard(steps, initialValues, {
      navigate: () => {
        navigate(wizard.currentStep)
      }
    })
    wizard.start(refreshState)
    return wizard;
  })
  const location = useLocation();
  const stepFromLocation = location.pathname.split('/').pop();

  useEffect(() => {
    if (stepFromLocation !== currentWizard.currentStep) {
      currentWizard.sync({ step: stepFromLocation })
    }
  }, [stepFromLocation, currentWizard])
  return Object.create(currentWizard);
}

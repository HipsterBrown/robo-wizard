import * as React from 'react';
import { Route, useHistory, Switch, Redirect } from 'react-router-dom';
import { createWizard } from '../../src/index';

const WizardContext = React.createContext(null);

export function Step({ name, ...routeProps }) {
  return <Route path={`/${name}`} {...routeProps} />;
}

export function WizardProvider({ children, initialValues }) {
  const steps = React.Children.map(children, child => {
    if (child.type === Step) return child.props;
    return null;
  }).filter(Boolean);
  const wizard = useWizard(steps, initialValues);

  return (
    <WizardContext.Provider value={wizard}>
      {children}
      <Switch>
        <Redirect from="/" to={`/${steps[0].name}`} exact />
      </Switch>
    </WizardContext.Provider>
  );
}

export function useWizardContext() {
  const wizard = React.useContext(WizardContext);
  return wizard;
}

function useWizard(steps, initialValues) {
  const history = useHistory();
  const [_, refreshState] = React.useState(false);
  const [currentWizard, setWizard] = React.useState(() => {
    const wizard = createWizard(steps, initialValues, {
      navigate: () => {
        history.push(`/${wizard.currentStep}`);
      },
    });
    wizard.start(() => refreshState(s => !s));
    return wizard;
  });
  return currentWizard;
}

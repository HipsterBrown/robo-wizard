import { createWizard } from 'robo-wizard';
import history from 'history/browser';


type Values = {
  firstName?: string;
  lastName?: string;
};

const steps: HTMLElement[] = Array.prototype.slice.call(
  document.querySelectorAll('[data-step]')
);
const currentStep = document.querySelector('[data-current-step]')
const currentValues = document.querySelectorAll<HTMLElement>('[data-values]')
const stepInputs = document.querySelectorAll<HTMLInputElement>('input');

const wizard = createWizard<Values>(steps.map(element => element.dataset.step), { firstName: '', lastName: '' }, {
  navigate: () => {
    history.push(`/${wizard.currentStep}`)
  }
});

function render() {
  if (currentStep) currentStep.textContent = wizard.currentStep;
  currentValues.forEach((element: HTMLElement) => {
    element.textContent = wizard.currentValues[element.dataset.values] || '';
  });
  stepInputs.forEach((element: HTMLInputElement) => {
    element.value = wizard.currentValues[element.name] || '';
  });

  for (const step of steps) {
    if (step.dataset.step === wizard.currentStep) {
      step.classList.remove('hidden');
    } else {
      step.classList.add('hidden');
    }
  }
}

document.querySelectorAll<HTMLButtonElement>('button[data-event]').forEach(button =>
  button.addEventListener('click', ({ target }) => {
    const { dataset } = target as HTMLButtonElement;
    if (dataset.event === 'previous') {
      wizard.goToPreviousStep();
    }
  })
);

document.querySelectorAll<HTMLFormElement>('form[data-event]').forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget as HTMLFormElement))
    wizard.goToNextStep({ values });
  });
});

if (history.location.pathname === '/') {
  history.push(`/${steps[0].dataset.step}`)
}

history.listen(({ location }) => {
  const stepFromPath = location.pathname.split('/').pop();
  if (stepFromPath && stepFromPath !== wizard.currentStep) wizard.sync({ step: stepFromPath })
})

wizard.start(render);

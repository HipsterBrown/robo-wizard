import { createWizard } from '../../src';

type Values = {
  firstName?: string;
  lastName?: string;
};

const steps: HTMLElement[] = Array.prototype.slice.call(
  document.querySelectorAll('[data-step]')
);

const wizard = createWizard<Values>(steps.map(element => element.dataset.step));

function render() {
  document.querySelector('[data-current-step]').textContent =
    wizard.currentStep;
  document.querySelectorAll('[data-values]').forEach((element: HTMLElement) => {
    element.textContent = wizard.currentValues[element.dataset.values] || '';
  });
  document.querySelectorAll('input').forEach((element: HTMLInputElement) => {
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

document.querySelectorAll('button[data-event]').forEach(button =>
  button.addEventListener('click', ({ target }) => {
    const { dataset } = target as HTMLButtonElement;
    if (dataset.event === 'previous') {
      wizard.goToPreviousStep();
    }
  })
);

document.querySelectorAll('form[data-event]').forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(event.target as HTMLFormElement);
    const values = {};
    data.forEach((value, field) => {
      values[field] = value;
    });

    wizard.goToNextStep({ values });
  });
});

wizard.start(render);

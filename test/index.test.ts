import { createWizard, when, WhenFunction } from '../src';

describe('createWizard', () => {
  describe('using array of strings', () => {
    const steps = ['first', 'second', 'third'];

    it('progresses forward linearly', () => {
      let currentStep;
      let nextStep = (_event?: { values: object }) => {};
      let previousStep = () => {};
      const wizard = createWizard(steps);

      wizard.start(({ currentStep: step, goToNextStep, goToPreviousStep }) => {
        currentStep = step;
        nextStep = goToNextStep;
        previousStep = goToPreviousStep;
      });

      expect(currentStep).toBe('first');

      nextStep();

      expect(currentStep).toBe('second');

      nextStep();

      expect(currentStep).toBe('third');

      nextStep();

      // should not change
      expect(currentStep).toBe('third');

      previousStep();

      expect(currentStep).toBe('second');

      previousStep();

      expect(currentStep).toBe('first');

      previousStep();

      // should not change
      expect(currentStep).toBe('first');
    });

    it('updates values during progression', () => {
      let currentValues;
      let nextStep = (_event: { values?: object }) => {};
      let previousStep = () => {};
      const wizard = createWizard(steps);

      wizard.start(
        ({ currentValues: values, goToNextStep, goToPreviousStep }) => {
          currentValues = values;
          nextStep = goToNextStep;
          previousStep = goToPreviousStep;
        }
      );

      expect(currentValues).toMatchObject({});

      nextStep({ values: { test: 'string' } });

      expect(currentValues).toMatchObject({ test: 'string' });

      nextStep({ values: { another: 'value' } });

      expect(currentValues).toMatchObject({ test: 'string', another: 'value' });

      nextStep({ values: { nothing: 'doing' } });

      // should not update because no progress forward
      expect(currentValues).toMatchObject({ test: 'string', another: 'value' });

      previousStep();

      // does not update values
      expect(currentValues).toMatchObject({ test: 'string', another: 'value' });
    });
  });

  describe('array of config objects', () => {
    const steps = [{ name: 'first' }, { name: 'second' }, { name: 'third' }];

    it('progresses forward linearly', () => {
      let currentStep;
      let next = () => {};
      let previous = () => {};
      const wizard = createWizard(steps);

      wizard.start(({ currentStep: step, goToNextStep, goToPreviousStep }) => {
        currentStep = step;
        next = goToNextStep;
        previous = goToPreviousStep;
      });

      expect(currentStep).toBe('first');

      next();

      expect(currentStep).toBe('second');

      next();

      expect(currentStep).toBe('third');

      next();

      // should not change
      expect(currentStep).toBe('third');

      previous();

      expect(currentStep).toBe('second');

      previous();

      expect(currentStep).toBe('first');

      previous();

      // should not change
      expect(currentStep).toBe('first');
    });
  });

  describe('steps with next, previous config', () => {
    const steps = [
      { name: 'first', next: 'third' },
      { name: 'second', next: false, previous: 'third' },
      { name: 'third' },
    ];

    it('progresses forward linearly', () => {
      let currentStep;
      let next = () => {};
      let previous = () => {};
      const wizard = createWizard(steps);

      wizard.start(({ currentStep: step, goToNextStep, goToPreviousStep }) => {
        currentStep = step;
        next = goToNextStep;
        previous = goToPreviousStep;
      });

      expect(currentStep).toBe('first');

      next();

      expect(currentStep).toBe('third');

      previous();

      expect(currentStep).toBe('second');

      next();

      // should not change
      expect(currentStep).toBe('second');

      previous();

      expect(currentStep).toBe('third');
    });
  });

  describe('steps with conditional next config', () => {
    const initialValues = { skip: false };
    type Values = typeof initialValues;
    const skipIsTrue: WhenFunction<Values> = (values, { values: nextValues }) =>
      ({ ...values, ...nextValues }.skip);
    const steps = [
      { name: 'first', next: [['third', when<Values>(skipIsTrue)], 'second'] },
      'second',
      'third',
    ];

    it('progresses forward conditionally', () => {
      let currentStep;
      let currentValues;
      let next = (_event?: { values?: Values }) => {};
      let previous = () => {};
      const wizard = createWizard(steps, initialValues);

      wizard.start(
        ({
          currentStep: step,
          currentValues: values,
          goToNextStep,
          goToPreviousStep,
        }) => {
          currentStep = step;
          currentValues = values;
          next = goToNextStep;
          previous = goToPreviousStep;
        }
      );

      expect(currentValues).toMatchObject(initialValues);

      next();

      expect(currentStep).toBe('second');

      previous();

      expect(currentStep).toBe('first');

      next({ values: { skip: true } });

      expect(currentStep).toBe('third');
    });
  });
});

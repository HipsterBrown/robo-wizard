import { describe, it, expect, vi } from 'vitest';
import { createWizard, when, WhenFunction } from '../src';

describe('createWizard', () => {
  describe('using array of strings', () => {
    const steps = ['first', 'second', 'third'];

    it('progresses forward linearly', () => {
      let currentStep;
      let nextStep = (_event?: { values: object }) => { };
      let previousStep = () => { };
      const wizard = createWizard(steps);

      wizard.start(wiz => {
        currentStep = wiz.currentStep;
        nextStep = wiz.goToNextStep.bind(wiz);
        previousStep = wiz.goToPreviousStep.bind(wiz);
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
      let nextStep = (_event: { values?: object }) => { };
      let previousStep = () => { };
      const wizard = createWizard(steps);

      wizard.start(wiz => {
        currentValues = wiz.currentValues;
        nextStep = wiz.goToNextStep.bind(wiz);
        previousStep = wiz.goToPreviousStep.bind(wiz);
      });

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
      const wizard = createWizard(steps);
      wizard.start(() => { });

      expect(wizard.currentStep).toBe('first');

      wizard.goToNextStep();

      expect(wizard.currentStep).toBe('second');

      wizard.goToNextStep();

      expect(wizard.currentStep).toBe('third');

      wizard.goToNextStep();

      // should not change
      expect(wizard.currentStep).toBe('third');

      wizard.goToPreviousStep();

      expect(wizard.currentStep).toBe('second');

      wizard.goToPreviousStep();

      expect(wizard.currentStep).toBe('first');

      wizard.goToPreviousStep();

      // should not change
      expect(wizard.currentStep).toBe('first');
    });
  });

  describe('steps with next, previous config', () => {
    const steps = [
      { name: 'first', next: 'third' },
      { name: 'second', next: false, previous: 'third' },
      { name: 'third' },
    ];

    it('progresses forward linearly', () => {
      const wizard = createWizard(steps);
      wizard.start(() => { });

      expect(wizard.currentStep).toBe('first');

      wizard.goToNextStep();

      expect(wizard.currentStep).toBe('third');

      wizard.goToPreviousStep();

      expect(wizard.currentStep).toBe('second');

      wizard.goToNextStep();

      // should not change
      expect(wizard.currentStep).toBe('second');

      wizard.goToPreviousStep();

      expect(wizard.currentStep).toBe('third');
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
      const wizard = createWizard(steps, initialValues);

      wizard.start(() => { });

      expect(wizard.currentValues).toMatchObject(initialValues);

      wizard.goToNextStep();

      expect(wizard.currentStep).toBe('second');

      wizard.goToPreviousStep();

      expect(wizard.currentStep).toBe('first');

      wizard.goToNextStep({ values: { skip: true } });

      expect(wizard.currentStep).toBe('third');
    });
  });

  describe('when passing navigate action', () => {
    const steps = ['first', 'second', 'third'];

    it('calls navigate when entering a step', () => {
      const navigate = vi.fn();
      const wizard = createWizard(steps, {}, { navigate })

      wizard.start(() => { });

      expect(navigate).not.toHaveBeenCalled();

      wizard.goToNextStep()

      expect(navigate).toHaveBeenCalled();

      wizard.goToPreviousStep()

      expect(navigate).toHaveBeenCalledTimes(2);
    })
  })

  describe('when calling sync method', () => {
    const steps = ['first', 'second', 'third'];

    it('updates the currentStep without navigating', () => {
      const navigate = vi.fn();
      const wizard = createWizard(steps, {}, { navigate })

      wizard.start(() => { });

      expect(wizard.currentStep).toBe('first')

      wizard.sync({ step: 'third' });

      expect(wizard.currentStep).toBe('third')

      expect(navigate).not.toHaveBeenCalled();
    })
  })
});

import { createWizard, when, WhenFunction } from '../src';

describe('createWizard', () => {
  describe('using array of strings', () => {
    const steps = ['first', 'second', 'third'];

    it('progresses forward linearly', () => {
      let currentStep;
      let update = (_transition: string) => {};
      const wizard = createWizard(steps);

      wizard.start(({ currentStep: step, send }) => {
        currentStep = step;
        update = send;
      });

      expect(currentStep).toBe('first');

      update('next');

      expect(currentStep).toBe('second');

      update('next');

      expect(currentStep).toBe('third');

      update('next');

      // should not change
      expect(currentStep).toBe('third');

      update('previous');

      expect(currentStep).toBe('second');

      update('previous');

      expect(currentStep).toBe('first');

      update('previous');

      // should not change
      expect(currentStep).toBe('first');
    });

    it('updates values during progression', () => {
      let currentValues;
      let update = (_event: { type: string; values?: object }) => {};
      const wizard = createWizard(steps);

      wizard.start(({ currentValues: values, send }) => {
        currentValues = values;
        update = send;
      });

      expect(currentValues).toMatchObject({});

      update({ type: 'next', values: { test: 'string' } });

      expect(currentValues).toMatchObject({ test: 'string' });

      update({ type: 'next', values: { another: 'value' } });

      expect(currentValues).toMatchObject({ test: 'string', another: 'value' });

      update({ type: 'next', values: { nothing: 'doing' } });

      // should not update because no progress forward
      expect(currentValues).toMatchObject({ test: 'string', another: 'value' });

      update({ type: 'previous' });

      // does not update values
      expect(currentValues).toMatchObject({ test: 'string', another: 'value' });
    });
  });

  describe('array of config objects', () => {
    const steps = [{ name: 'first' }, { name: 'second' }, { name: 'third' }];

    it('progresses forward linearly', () => {
      let currentStep;
      let update = (_transition: string) => {};
      const wizard = createWizard(steps);

      wizard.start(({ currentStep: step, send }) => {
        currentStep = step;
        update = send;
      });

      expect(currentStep).toBe('first');

      update('next');

      expect(currentStep).toBe('second');

      update('next');

      expect(currentStep).toBe('third');

      update('next');

      // should not change
      expect(currentStep).toBe('third');

      update('previous');

      expect(currentStep).toBe('second');

      update('previous');

      expect(currentStep).toBe('first');

      update('previous');

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
      let update = (_transition: string) => {};
      const wizard = createWizard(steps);

      wizard.start(({ currentStep: step, send }) => {
        currentStep = step;
        update = send;
      });

      expect(currentStep).toBe('first');

      update('next');

      expect(currentStep).toBe('third');

      update('previous');

      expect(currentStep).toBe('second');

      update('next');

      // should not change
      expect(currentStep).toBe('second');

      update('previous');

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
      let update = (_event: { type: string; values?: Values }) => {};
      const wizard = createWizard(steps, initialValues);

      wizard.start(({ currentStep: step, currentValues: values, send }) => {
        currentStep = step;
        currentValues = values;
        update = send;
      });

      expect(currentValues).toMatchObject(initialValues);

      update({ type: 'next' });

      expect(currentStep).toBe('second');

      update({ type: 'previous' });

      expect(currentStep).toBe('first');

      update({ type: 'next', values: { skip: true } });

      expect(currentStep).toBe('third');
    });
  });
});

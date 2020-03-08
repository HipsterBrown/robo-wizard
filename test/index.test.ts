import { createFlow } from '../src';

describe('createFlow', () => {
  describe('using array of strings', () => {
    const steps = ['first', 'second', 'third'];

    it('progresses forward linearly', () => {
      let currentStep;
      let update = (_transition: string) => {};
      const flow = createFlow(steps);

      flow.start((step, _values, send) => {
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
      const flow = createFlow(steps);

      flow.start((_step, _values, send) => {
        currentValues = _values;
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
      const flow = createFlow(steps);

      flow.start((step, _values, send) => {
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
      const flow = createFlow(steps);

      flow.start((step, _values, send) => {
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
});

import { afterEach, jest, test } from 'bun:test';
import assert from 'node:assert/strict';

import { createPendingIndicator } from '../src/lib/pending-indicator.ts';

let activeIndicator;
afterEach(() => {
  activeIndicator?.dispose();
  jest.useRealTimers();
});

function setup() {
  jest.useFakeTimers({ now: 0 });
  const changes = [];
  const indicator = createPendingIndicator((visible) => changes.push({ visible, at: Date.now() }));
  activeIndicator = indicator;
  return { changes, indicator, tick: (ms) => jest.advanceTimersByTime(ms) };
}

test('fast requests never show a skeleton', () => {
  const { changes, indicator, tick } = setup();
  indicator.setPending(true);
  tick(100);
  indicator.setPending(false);
  tick(1000);
  assert.deepEqual(changes, []);
});

test('slow requests wait 300ms and keep the skeleton visible for 300ms', () => {
  const { changes, indicator, tick } = setup();
  indicator.setPending(true);
  tick(299);
  assert.deepEqual(changes, []);
  tick(1);
  indicator.setPending(false);
  tick(299);
  assert.deepEqual(changes, [{ visible: true, at: 300 }]);
  tick(1);
  assert.deepEqual(changes, [
    { visible: true, at: 300 },
    { visible: false, at: 600 },
  ]);
});

test('a restarted request cancels the pending hide without flashing', () => {
  const { changes, indicator, tick } = setup();
  indicator.setPending(true);
  tick(300);
  indicator.setPending(false);
  tick(100);
  indicator.setPending(true);
  tick(500);
  assert.deepEqual(changes, [{ visible: true, at: 300 }]);
  indicator.setPending(false);
  // Bun models the minimum 1ms timeout delay.
  tick(1);
  assert.deepEqual(changes, [
    { visible: true, at: 300 },
    { visible: false, at: 901 },
  ]);
});

test('unmount cancels scheduled visibility changes', () => {
  const { changes, indicator, tick } = setup();
  indicator.setPending(true);
  indicator.dispose();
  tick(1000);
  assert.deepEqual(changes, []);
});

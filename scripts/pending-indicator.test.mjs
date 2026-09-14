import assert from 'node:assert/strict';
import { test } from 'node:test';

import { createPendingIndicator } from '../src/lib/pending-indicator.ts';

function setup(t) {
  t.mock.timers.enable({ apis: ['setTimeout', 'Date'], now: 0 });
  const changes = [];
  const indicator = createPendingIndicator((visible) => changes.push({ visible, at: Date.now() }));
  t.after(() => indicator.dispose());
  return { changes, indicator, tick: (ms) => t.mock.timers.tick(ms) };
}

test('fast requests never show a skeleton', (t) => {
  const { changes, indicator, tick } = setup(t);
  indicator.setPending(true);
  tick(100);
  indicator.setPending(false);
  tick(1000);
  assert.deepEqual(changes, []);
});

test('slow requests wait 300ms and keep the skeleton visible for 300ms', (t) => {
  const { changes, indicator, tick } = setup(t);
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

test('a restarted request cancels the pending hide without flashing', (t) => {
  const { changes, indicator, tick } = setup(t);
  indicator.setPending(true);
  tick(300);
  indicator.setPending(false);
  tick(100);
  indicator.setPending(true);
  tick(500);
  assert.deepEqual(changes, [{ visible: true, at: 300 }]);
  indicator.setPending(false);
  tick(0);
  assert.deepEqual(changes, [
    { visible: true, at: 300 },
    { visible: false, at: 900 },
  ]);
});

test('unmount cancels scheduled visibility changes', (t) => {
  const { changes, indicator, tick } = setup(t);
  indicator.setPending(true);
  indicator.dispose();
  tick(1000);
  assert.deepEqual(changes, []);
});

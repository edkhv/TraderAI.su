import test from 'node:test';
import assert from 'node:assert/strict';
import { createDraft, demoPolicy, evaluate, makeEvent } from '../src/demo/engine.ts';
import type { DemoEvent, Mode, Scenario } from '../src/demo/engine.ts';

const modes: Mode[] = ['manual', 'plan', 'algorithm'];
for (const mode of modes) {
  test(`${mode}: known synthetic event is traceable, never executable`, () => {
    const result = evaluate(makeEvent(mode, 'normal'));
    assert.equal(result.status, mode === 'manual' ? 'recorded' : 'eligible');
    assert.equal(result.executionEnabled, false);
    assert.ok(result.checks.every((check) => check.passed));
  });
  test(`${mode}: excess size is blocked`, () => {
    assert.equal(evaluate(makeEvent(mode, 'over-limit')).status, 'blocked');
  });
  test(`${mode}: missing exit requests clarification`, () => {
    assert.equal(evaluate(makeEvent(mode, 'missing-exit')).status, 'needs_clarification');
  });
  test(`${mode}: no provenance means no eligibility`, () => {
    assert.equal(evaluate(makeEvent(mode, 'missing-source')).status, 'blocked');
  });
}
test('invalid volume fails closed at runtime', () => {
  for (const units of [-1, 0, 0.5, 21, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
    assert.equal(evaluate({ ...makeEvent('plan', 'normal'), units }).status, 'blocked');
  }
  assert.equal(evaluate({ ...makeEvent('plan', 'normal'), units: 20 }).status, 'eligible');
});
test('unknown version, mode and real environment are blocked', () => {
  for (const override of [{ version: 'other' }, { mode: 'llm' }, { environment: 'live' }]) {
    const result = evaluate({ ...makeEvent('plan', 'normal'), ...override } as DemoEvent);
    assert.equal(result.status, 'blocked');
    assert.equal(result.executionEnabled, false);
  }
});
test('drafts cannot change the active rules or event', () => {
  const before = JSON.stringify(demoPolicy);
  for (const mode of modes) {
    for (const scenario of [
      'normal',
      'over-limit',
      'missing-exit',
      'missing-source',
    ] as Scenario[]) {
      const event = makeEvent(mode, scenario);
      const eventBefore = JSON.stringify(event);
      const result = evaluate(event);
      const draft = createDraft(result);
      assert.equal(draft.status, 'proposed');
      assert.equal(draft.activeVersion, 'DEMO-v1');
      assert.equal(draft.requiresSeparateReview, true);
      assert.equal(JSON.stringify(event), eventBefore);
      assert.equal(JSON.stringify(demoPolicy), before);
      assert.equal(result.executionEnabled, false);
      assert.deepEqual(result, evaluate(event));
    }
  }
});
test('result keeps its own immutable event snapshot', () => {
  const event = { ...makeEvent('algorithm', 'normal') };
  const result = evaluate(event);
  event.units = 999;
  assert.equal(result.event.units, 10);
  assert.ok(Object.isFrozen(result.event));
  assert.ok(Object.isFrozen(result.checks));
});

/** Independent teaching example. It is not a production risk engine. */
export type Mode = 'manual' | 'plan' | 'algorithm';
export type Scenario = 'normal' | 'over-limit' | 'missing-exit' | 'missing-source';
export type DemoStatus = 'recorded' | 'eligible' | 'blocked' | 'needs_clarification';
export interface DemoEvent {
  readonly mode: Mode;
  readonly environment: 'synthetic';
  readonly sourceId: string | null;
  readonly version: string;
  readonly units: number;
  readonly exitDefined: boolean;
}
export interface DemoResult {
  readonly status: DemoStatus;
  readonly explanation: string;
  readonly checks: readonly { label: string; passed: boolean }[];
  readonly executionEnabled: false;
  readonly event: DemoEvent;
}
export const demoPolicy = Object.freeze({
  version: 'DEMO-v1',
  maxUnits: 20,
  environment: 'synthetic',
} as const);

export function makeEvent(mode: Mode, scenario: Scenario): DemoEvent {
  return Object.freeze({
    mode,
    environment: 'synthetic',
    sourceId: scenario === 'missing-source' ? null : `DEMO-${mode}-01`,
    version: demoPolicy.version,
    units: scenario === 'over-limit' ? 30 : 10,
    exitDefined: scenario !== 'missing-exit',
  });
}

export function evaluate(event: DemoEvent): DemoResult {
  const checks = [
    { label: 'Только синтетическая среда', passed: event.environment === 'synthetic' },
    {
      label: 'Источник и известная версия',
      passed: Boolean(event.sourceId?.startsWith('DEMO-')) && event.version === demoPolicy.version,
    },
    {
      label: 'Разрешённый тип источника',
      passed: ['manual', 'plan', 'algorithm'].includes(event.mode),
    },
    {
      label: 'Объём: целое число от 1 до 20 учебных единиц',
      passed:
        Number.isSafeInteger(event.units) && event.units > 0 && event.units <= demoPolicy.maxUnits,
    },
    { label: 'Условие выхода явно определено', passed: event.exitDefined === true },
  ];
  let status: DemoStatus;
  let explanation: string;
  if (checks.slice(0, 4).some((check) => !check.passed)) {
    status = 'blocked';
    explanation = 'Проверка не пройдена. Причина сохранена в демонстрационном журнале.';
  } else if (!checks[4].passed) {
    status = 'needs_clarification';
    explanation =
      'Нужно уточнение: не определено условие выхода. Автоматический допуск заблокирован.';
  } else if (event.mode === 'manual') {
    status = 'recorded';
    explanation =
      'Учебный факт ручной торговли записан для анализа. Импорт истории не создаёт новый ордер.';
  } else {
    status = 'eligible';
    explanation =
      'Учебные проверки пройдены. Событие записано в деможурнал; реальное исполнение отсутствует.';
  }
  return Object.freeze({
    status,
    explanation,
    checks: Object.freeze(checks.map((check) => Object.freeze(check))),
    executionEnabled: false,
    event: Object.freeze({ ...event }),
  });
}

export function createDraft(result: DemoResult) {
  return Object.freeze({
    id: `DRAFT-${result.event.mode}-${result.status}`,
    basedOn: result.event.version,
    status: 'proposed' as const,
    activeVersion: demoPolicy.version,
    requiresSeparateReview: true,
    text:
      result.status === 'needs_clarification'
        ? 'Уточнить условие выхода и проверить новую версию на отдельной учебной выборке.'
        : 'Исследовать другое условие отмены на отдельной учебной выборке.',
  });
}

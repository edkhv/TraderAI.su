import { makeEvent, evaluate, createDraft, demoPolicy } from './engine';
import type { Mode, Scenario, DemoResult } from './engine';
const root = document.querySelector<HTMLElement>('[data-demo]');
if (root) {
  const el = <T extends HTMLElement>(selector: string) => {
    const element = root.querySelector<T>(selector);
    if (!element) throw new Error(`Missing demo element: ${selector}`);
    return element;
  };
  let mode: Mode = 'plan';
  let result: DemoResult | null = null;
  const descriptions = {
    manual: [
      'Подтверждённый учебный факт',
      'Предзаданная запись ручной сделки. Анализ истории не даёт разрешения повторить её.',
    ],
    plan: [
      'Условие учебного плана',
      'Предзаданный пример срабатывания утверждённого условия. Это не интерпретация текста действующей моделью.',
    ],
    algorithm: [
      'Сигнал учебного алгоритма',
      'Предзаданное событие версии DEMO-v1. Никакой пользовательский код не исполняется.',
    ],
  };
  function reset() {
    result = null;
    el('[data-result]').hidden = true;
    el('[data-empty]').hidden = false;
    el('[data-draft]').textContent = '';
    el<HTMLButtonElement>('[data-propose]').disabled = false;
    el('[data-source-title]').textContent = descriptions[mode][0];
    el('[data-source-text]').textContent = descriptions[mode][1];
    el('[data-version]').textContent = demoPolicy.version;
  }
  root.querySelectorAll<HTMLButtonElement>('[data-mode]').forEach((button) => {
    button.addEventListener('click', () => {
      mode = button.dataset.mode as Mode;
      root
        .querySelectorAll('[data-mode]')
        .forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      reset();
    });
  });
  el<HTMLSelectElement>('[data-scenario]').addEventListener('change', reset);
  el('[data-run]').addEventListener('click', () => {
    const scenario = el<HTMLSelectElement>('[data-scenario]').value as Scenario;
    result = evaluate(makeEvent(mode, scenario));
    const journal = el('[data-journal]');
    journal.replaceChildren();
    for (const check of result.checks) {
      const item = document.createElement('li');
      const content = document.createElement('div');
      const title = document.createElement('strong');
      const detail = document.createElement('p');
      title.textContent = check.label;
      detail.textContent = check.passed
        ? 'Пройдено · учебная проверка'
        : 'Не пройдено · дальнейший допуск заблокирован';
      content.append(title, detail);
      item.append(content);
      journal.append(item);
    }
    el('[data-status]').textContent = result.explanation;
    el('[data-status]').dataset.state = result.status;
    el('[data-analysis]').textContent =
      result.status === 'eligible' || result.status === 'recorded'
        ? 'Подготовленное наблюдение: происхождение и версия события известны. Одного события недостаточно для оценки качества стратегии.'
        : 'Подготовленное наблюдение: отказ или неполные данные сохранены. Это тоже результат процесса, а не пропущенная запись.';
    el('[data-result]').hidden = false;
    el('[data-empty]').hidden = true;
    el('[data-draft]').textContent = '';
    el<HTMLButtonElement>('[data-propose]').disabled = false;
  });
  el('[data-propose]').addEventListener('click', () => {
    if (!result) return;
    const draft = createDraft(result);
    el('[data-draft]').textContent =
      `Создан проект ${draft.id}. ${draft.text} Активная версия ${draft.activeVersion} не изменилась.`;
    el<HTMLButtonElement>('[data-propose]').disabled = true;
  });
  el('[data-reset]').addEventListener('click', reset);
  reset();
}

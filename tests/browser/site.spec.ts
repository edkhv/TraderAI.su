import { test, expect } from '@playwright/test';

test('demo preserves rules; blocks excess size, incomplete exits and lost provenance', async ({
  page,
}) => {
  const external: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:4321') external.push(request.url());
  });
  await page.goto('/demo/');
  for (const name of ['Вручную', 'По плану', 'Алгоритм']) {
    await page.getByRole('button', { name, exact: true }).click();
    await page.getByLabel('Учебная ситуация').selectOption('normal');
    await page.getByRole('button', { name: 'Проверить сценарий · демо' }).click();
    await expect(page.locator('[data-status]')).toContainText(
      name === 'Вручную' ? 'не создаёт новый ордер' : 'реальное исполнение отсутствует',
    );
    await page.getByRole('button', { name: 'Создать проект подсказки · демо' }).click();
    await expect(page.locator('[data-draft]')).toContainText(
      'Активная версия DEMO-v1 не изменилась',
    );
    await expect(page.locator('[data-version]')).toHaveText('DEMO-v1');
  }
  for (const [value, message] of [
    ['over-limit', 'Проверка не пройдена'],
    ['missing-exit', 'Нужно уточнение'],
    ['missing-source', 'Проверка не пройдена'],
  ]) {
    await page.getByLabel('Учебная ситуация').selectOption(value);
    await expect(page.locator('[data-result]')).toBeHidden();
    await page.getByRole('button', { name: 'Проверить сценарий · демо' }).click();
    await expect(page.locator('[data-status]')).toContainText(message);
  }
  await page.reload();
  await expect(page.locator('[data-result]')).toBeHidden();
  expect(external).toEqual([]);
  expect(await page.context().cookies()).toEqual([]);
});

for (const width of [320, 360, 390, 768, 1024, 1440]) {
  test(`responsive layout at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ['/', '/for-authors/', '/demo/', '/contacts/', '/technology/']) {
      await page.goto(path);
      if (path === '/' && [390, 1440].includes(width))
        await page.screenshot({
          path: `artifacts/home-${width}.png`,
          fullPage: width < 500,
          animations: 'disabled',
        });
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      ).toBeTruthy();
      await expect(page.locator('h1')).toBeVisible();
    }
  });
}
test('navigation, contacts and content work without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/');
  await expect(page.locator('h1')).toContainText('Знакомая');
  await page.locator('summary[aria-label="Открыть меню"]').press('Enter');
  await page
    .getByRole('navigation', { name: 'Мобильная навигация' })
    .getByRole('link', { name: 'Для трейдеров' })
    .click();
  await expect(page.locator('#modes')).toContainText('Ручная торговля');
  await page.goto('http://127.0.0.1:4321/contacts/');
  await expect(page.locator('a[href="https://t.me/Eduard_KHV"]')).toBeVisible();
  await context.close();
});
test('visual assets load locally and reduced motion leaves content visible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('.hero h1')).toBeVisible();
  for (const selector of ['.hero-art img', '.editorial-photo img']) {
    const image = page.locator(selector);
    await image.scrollIntoViewIfNeeded();
    await expect(image).toBeVisible();
    await expect
      .poll(() =>
        image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0),
      )
      .toBeTruthy();
  }
  await page.locator('.mode-art').first().scrollIntoViewIfNeeded();
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  expect(await page.evaluate(() => document.fonts.check('500 20px "Unbounded"'))).toBe(true);
  expect(await page.evaluate(() => document.fonts.check('400 20px "Golos Text"'))).toBe(true);
});
test('unknown routes return 404, public routes return 200, no browser errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const route of [
    '/',
    '/technology/',
    '/for-authors/',
    '/how-it-works/',
    '/safety/',
    '/risks/',
    '/contacts/',
    '/privacy/',
    '/early-access/',
    '/demo/',
  ]) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
  }
  expect((await page.goto('/this-route-does-not-exist/'))?.status()).toBe(404);
  expect(errors).toEqual([]);
});

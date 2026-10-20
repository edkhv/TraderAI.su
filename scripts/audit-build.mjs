import { readFile, readdir, stat } from 'node:fs/promises';
import assert from 'node:assert/strict';
import path from 'node:path';
const root = path.resolve('dist');
const base = (process.env.SITE_BASE || '/').replace(/\/$/, '');
async function files(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((item) =>
      item.isDirectory() ? files(path.join(dir, item.name)) : [path.join(dir, item.name)],
    ),
  );
  return nested.flat();
}
const paths = await files(root);
let htmlCount = 0;
for (const file of paths) {
  assert.ok(
    !/\.(?:map|db|sqlite|pem|key|md|ts|zip|tar|gz)$/.test(file),
    `Unexpected publishable file: ${file}`,
  );
  assert.ok(!file.split(path.sep).some((part) => part.startsWith('.')), `Hidden file: ${file}`);
  if (!/\.(?:html|js|css|xml|txt|svg)$/.test(file)) continue;
  const text = await readFile(file, 'utf8');
  for (const pattern of [
    /\/Users\//,
    /PRIVATE KEY/,
    /gh[pousr]_[A-Za-z0-9]{30,}/,
    /\b(?:\d{1,3}\.){3}\d{1,3}\b/,
    /PRIVATE_SPEC/,
  ]) {
    assert.ok(!pattern.test(text), `Private or credential-like material in ${file}`);
  }
  if (!file.endsWith('.html')) continue;
  htmlCount++;
  assert.equal((text.match(/<h1(?:\s|>)/g) || []).length, 1, `One h1: ${file}`);
  assert.ok(text.includes('lang="ru"'), `Russian language: ${file}`);
  assert.ok(/name="description"/.test(text), `Description missing: ${file}`);
  assert.ok(/rel="canonical"/.test(text), `Canonical missing: ${file}`);
  assert.ok(!/<form[\s>]|<input[\s>]/.test(text), `Collection form in static release: ${file}`);
  for (const match of text.matchAll(/(?:src|href)="([^"]+)"/g)) {
    const href = match[1];
    if (/^(https?:|mailto:|tel:|#)/.test(href)) {
      if (match[0].startsWith('src=')) assert.fail(`External resource in ${file}`);
      continue;
    }
    const pathname = href.split(/[?#]/)[0];
    assert.ok(pathname.startsWith(`${base}/`), `Unexpected base: ${href}`);
    let target = path.resolve(root, `.${pathname.slice(base.length)}`);
    assert.ok(target.startsWith(`${root}/`) || target === root);
    if (pathname.endsWith('/')) target = path.join(target, 'index.html');
    assert.ok((await stat(target)).isFile(), `Missing link target: ${href}`);
  }
}
assert.ok(htmlCount >= 10);
const demo = await readFile(path.join(root, 'demo/index.html'), 'utf8');
assert.ok(demo.includes('noindex, nofollow'));
const sitemap = await readFile(path.join(root, 'sitemap.xml'), 'utf8');
assert.ok(!sitemap.includes('/demo/'));
for (const text of await Promise.all(
  paths.filter((f) => f.endsWith('.js')).map((f) => readFile(f, 'utf8')),
)) {
  assert.ok(
    !/\b(?:fetch|XMLHttpRequest|WebSocket|localStorage|sessionStorage)\b/.test(text),
    'Client network or persistence detected',
  );
}
console.log(
  `Build audit passed: ${htmlCount} HTML pages, ${paths.length} files; links, privacy boundary and metadata checked.`,
);

import { defineConfig } from 'astro/config';

export default defineConfig({
  site: process.env.SITE_ORIGIN || 'https://traderai.su',
  base: process.env.SITE_BASE || '/',
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  vite: { build: { sourcemap: false, assetsInlineLimit: 0 } },
});

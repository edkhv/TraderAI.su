import type { APIRoute } from 'astro';
import { link } from '../lib/urls';
export const GET: APIRoute = ({ site }) => {
  const paths = [
    '',
    'for-authors/',
    'how-it-works/',
    'technology/',
    'safety/',
    'risks/',
    'contacts/',
    'early-access/',
    'privacy/',
  ];
  const entries = process.env.SITE_MODE === 'preview' ? [] : paths;
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.map((path) => `<url><loc>${new URL(link(path), site)}</loc></url>`).join('')}</urlset>`,
    { headers: { 'Content-Type': 'application/xml' } },
  );
};

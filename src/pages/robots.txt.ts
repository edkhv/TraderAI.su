import type { APIRoute } from 'astro';
export const GET: APIRoute = ({ site }) =>
  new Response(
    process.env.SITE_MODE === 'preview'
      ? 'User-agent: *\nDisallow: /\n'
      : `User-agent: *\nAllow: /\nSitemap: ${new URL(`${import.meta.env.BASE_URL.replace(/^\//, '')}sitemap.xml`, site)}\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );

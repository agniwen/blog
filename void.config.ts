import { defineConfig } from 'void/config';

export default defineConfig({
  sourceDir: 'src',
  target: 'cloudflare',
  inference: { bindings: { db: false }, scanDirs: ['src'] },
  head: {
    title: 'akumanoko',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'description', content: 'akumanoko' },
    ],
    link: [
      { rel: 'icon', href: '/favicon.ico' },
      { rel: 'preconnect', href: 'https://cdn.jsdelivr.net', crossorigin: 'anonymous' },
      ...['Regular', 'Medium'].map((weight) => ({
        rel: 'stylesheet',
        href: `https://cdn.jsdelivr.net/npm/misans@4.1.0/lib/Normal/MiSans-${weight}.min.css`,
        crossorigin: 'anonymous',
      })),
    ],
    htmlAttrs: { lang: 'en' },
    bodyAttrs: { class: 'relative antialiased' },
  },
  routing: { isr: false },
  cloudflare: {
    compatibility_date: '2026-09-14',
    compatibility_flags: ['nodejs_compat'],
    vars: { BETTER_AUTH_URL: 'https://akumanoko.com' },
    name: 'blog',
    account_id: 'b8f52910e25273ecc2fc719d582dece7',
    workers_dev: true,
    routes: [
      { pattern: 'akumanoko.com', custom_domain: true },
      { pattern: 'www.akumanoko.com', custom_domain: true },
    ],
    d1_databases: [
      {
        binding: 'DB',
        database_name: 'blog',
        database_id: '7381a7aa-92cc-411d-aabe-35c74abebea6',
        remote: process.env.BLOG_D1_REMOTE === '1',
        migrations_dir: 'drizzle/d1',
        migrations_pattern: 'drizzle/d1/*/migration.sql',
      },
    ],
    observability: { enabled: true, head_sampling_rate: 1, traces: { enabled: true } },
  },
});

import { defineConfig } from 'astro/config';
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://deanslist.dev',
  integrations: [icon()],
  // If using a project repo instead of username.github.io, uncomment:
  // base: '/deanslist',
});

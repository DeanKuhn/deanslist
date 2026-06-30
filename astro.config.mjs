import { defineConfig } from 'astro/config';
import icon from 'astro-icon';

import preact from '@astrojs/preact';

export default defineConfig({
  site: 'https://deanslist.dev',
  integrations: [icon(), preact()],
  // If using a project repo instead of username.github.io, uncomment:
  // base: '/deanslist',
});
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import emdash from 'emdash/astro';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    imageService: 'passthrough',
    platformProxy: {
      enabled: true
    }
  }),
  integrations: [emdash({
    database: {
      binding: 'DB' // Khai báo rõ để EmDash biết đọc DB từ D1
    }
  }), react()]
});
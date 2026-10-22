import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import emdash from 'emdash/astro';
import { d1, r2 } from '@emdash-cms/cloudflare'; // 👈 Import từ package Cloudflare chính thức

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    imageService: 'passthrough',
    platformProxy: {
      enabled: true
    }
  }),
  integrations: [
    react(),
    emdash({
      database: d1({ binding: 'DB' }), // 👈 Nối thẳng vào D1 của chúng ta
      storage: r2({ binding: 'MEDIA_BUCKET' }) // 👈 Nối thẳng vào kho ảnh R2
    })
  ]
});
// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  output: 'server',

  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: ['192.168.109.80.nip.io'],
      host: true,
      port: 4321,
      strictPort: true,
      hmr: {
        host: '192.168.109.80.nip.io',
        port: 4321,
      },
    },
  },

  adapter: cloudflare(),
  integrations: [react()],
});

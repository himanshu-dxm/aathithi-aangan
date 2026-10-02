// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // TODO: update to the final production domain once the site is live.
  site: 'https://atithiaangan.com',
  vite: {
    plugins: [tailwindcss()]
  }
});
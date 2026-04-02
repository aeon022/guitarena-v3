import { defineConfig } from 'astro/config';
// import orbiter from '@orbiter/integration';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [
    /* 
    orbiter({
      pod: '../content.pod'
    })
    */
  ],
  vite: {
    plugins: [tailwindcss()],
  }
});

import { defineConfig } from 'astro/config';
// import orbiter from '@orbiter/integration';
import tailwindcss from '@tailwindcss/vite';
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  integrations: [
    icon(),
    /* 
    orbiter({
      pod: '../content.pod'
    })
    */
  ],
  vite: {
    plugins: [tailwindcss()],
    server: {
      fs: {
        allow: ['..']
      }
    }
  }
});

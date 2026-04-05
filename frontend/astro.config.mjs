import { defineConfig } from 'astro/config';
// import orbiter from '@orbiter/integration';
import tailwindcss from '@tailwindcss/vite';
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: 'https://yard.starbase11.com',
  base: '/html/guitarena',
  trailingSlash: 'always',
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

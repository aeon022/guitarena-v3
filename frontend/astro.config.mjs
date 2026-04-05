import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import icon from "astro-icon";

const isBuild = process.argv.includes('build');

// https://astro.build/config
export default defineConfig({
  site: isBuild ? 'https://yard.starbase11.com' : 'http://localhost:4321',
  base: isBuild ? '/html/guitarena' : '/',
  trailingSlash: 'always',
  integrations: [
    icon(),
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

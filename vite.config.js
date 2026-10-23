import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' makes the built site work on GitHub Pages, Netlify and any sub-folder.
export default defineConfig({
  base: './',
  plugins: [react()],
});

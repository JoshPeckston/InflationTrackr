import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Relative assets so the built site works on GitHub Pages, file://, and CDNs.
  base: './',
  server: {
    host: '::',
    port: 5173,
    strictPort: true,
    allowedHosts: true,
  },
  preview: {
    host: '::',
    port: 4173,
    strictPort: true,
    allowedHosts: true,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});

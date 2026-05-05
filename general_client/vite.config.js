import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// Vite config for the Nox client.
//
// - `build.outDir` is `build/` so the Express server can keep serving
//   `general_client/build` exactly as before — no server changes needed.
// - The React plugin uses the classic JSX runtime to stay compatible with
//   React 16. It also processes .js files as JSX so the existing source tree
//   doesn't need any renames.
// - Dev server proxies API + websocket traffic to the Express backend so
//   `npm run dev` and `npm start` (server) co-exist on different ports.

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'classic',
      include: '**/*.{js,jsx}',
    }),
  ],
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: { '.js': 'jsx' },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'src'),
    },
  },
  build: {
    outDir: 'build',
    sourcemap: false,
  },
  server: {
    port: 3000,
    proxy: {
      '/nox/api': { target: 'http://localhost:5001', changeOrigin: true },
      '/socket.io': { target: 'http://localhost:5001', changeOrigin: true, ws: true },
    },
  },
  preview: {
    port: 4173,
  },
});

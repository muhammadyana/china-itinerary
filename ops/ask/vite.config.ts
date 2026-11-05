import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

// Bundles the ask server and the Anthropic SDK into one self-contained file for /opt/china-itinerary-ask.
export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  publicDir: false,
  logLevel: 'warn',
  ssr: { noExternal: true, target: 'node' },
  build: {
    ssr: 'server.ts',
    outDir: 'dist',
    emptyOutDir: true,
    target: 'node20',
    minify: false,
    sourcemap: false,
    rolldownOptions: {
      output: { format: 'es', entryFileNames: 'ask-server.mjs', codeSplitting: false },
    },
  },
});

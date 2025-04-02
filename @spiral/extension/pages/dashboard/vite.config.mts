import {resolve} from 'node:path';
import {withPageConfig} from '@extension/vite-config';
import tailwindcss from "@tailwindcss/vite"
import {nodePolyfills} from "vite-plugin-node-polyfills";

const rootDir = resolve(__dirname);
const srcDir = resolve(rootDir, 'src');

export default withPageConfig({
  plugins: [nodePolyfills(), tailwindcss()],
  resolve: {
    alias: {
      '@src': srcDir,
    },
  },
  define: {
    global: 'globalthis',
  },
  publicDir: resolve(rootDir, 'public'),
  build: {
    outDir: resolve(rootDir, '..', '..', 'dist', 'dashboard'),
  },

});

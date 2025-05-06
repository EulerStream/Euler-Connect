import {resolve} from 'node:path';
import {withPageConfig} from '@extension/vite-config';
import tailwindcss from "@tailwindcss/vite"

const rootDir = resolve(__dirname);
const srcDir = resolve(rootDir, 'src');

export default withPageConfig({
  plugins: [tailwindcss()],
  resolve: {
    alias: {
      '@src': srcDir,
    },
  },
  publicDir: resolve(rootDir, 'public'),
  build: {
    outDir: resolve(rootDir, '..', '..', 'dist', 'dashboard'),
  },
});

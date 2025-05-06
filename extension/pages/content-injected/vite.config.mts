import {resolve} from 'node:path';
import {makeEntryPointPlugin} from '@extension/hmr';
import {withPageConfig} from '@extension/vite-config';
import {IS_DEV} from '@extension/env';
import * as fs from "node:fs";

// @ts-expect-error
const rootDir = resolve(import.meta.dirname);
const srcDir = resolve(rootDir, 'src');

// Check if the content-injected dir exists
// If not, create it
const path = resolve(rootDir, '..', '..', 'dist', 'content-injected');
if (!fs.existsSync(path)) {
  fs.mkdirSync(path, {recursive: true});
}

export default withPageConfig({
  resolve: {
    alias: {
      '@src': srcDir,
    },
  },
  publicDir: resolve(rootDir, 'public'),
  plugins: [IS_DEV && makeEntryPointPlugin()],
  build: {
    lib: {
      name: 'ContentScript',
      fileName: 'index',
      formats: ['iife'],
      entry: resolve(srcDir, 'index.ts'),
    },
    outDir: resolve(path),
  },
});

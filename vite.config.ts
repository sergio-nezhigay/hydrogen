import {sentryVitePlugin} from '@sentry/vite-plugin';
import type {Plugin} from 'vite';
import {defineConfig} from 'vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import {oxygen} from '@shopify/mini-oxygen/vite';
import {vitePlugin as remix} from '@remix-run/dev';
import tsconfigPaths from 'vite-tsconfig-paths';

export function removeAsyncHooksPlugin(): Plugin {
  return {
    name: 'remove-async-hooks',
    load: (id) => {
      if (id === 'node:async_hooks') {
        return 'export default {}';
      }
    },
  };
}

export default defineConfig({
  plugins: [
    removeAsyncHooksPlugin(),
    hydrogen(),
    oxygen(),
    remix({
      presets: [hydrogen.preset()],
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    tsconfigPaths(),
    sentryVitePlugin({
      org: 'informatica-0v',
      project: 'javascript-remix',
      authToken: process.env.SENTRY_AUTH_TOKEN,
      sourcemaps: {
        // Specify files/directories to upload
        include: ['./dist'],
        ignore: ['node_modules'],
      },
    }),
  ],
  resolve: {
    alias: [
      {
        find: 'node:async_hooks',
        replacement: '',
        customResolver: () => {},
      },
    ],
  },
  ssr: {
    external: ['node:async_hooks'],
    optimizeDeps: {
      include: ['typographic-base', 'hoist-non-react-statics'],
    },
  },
  optimizeDeps: {
    include: [
      'clsx',
      'typographic-base',
      'react-intersection-observer',
      'react-use/esm/useScroll',
      'react-use/esm/useDebounce',
      'react-use/esm/useWindowScroll',
    ],
  },
  build: {
    // Allow a strict Content-Security-Policy
    // without inlining assets as base64:
    assetsInlineLimit: 0,

    sourcemap: true,
  },
});

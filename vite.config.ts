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
      authToken:
        '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',
      sourcemaps: {
        filesToDeleteAfterUpload: 'all',
        ignore: ['node_modules'],
      },
      // Add these new settings
      debug: true,

      telemetry: false, // Disable telemetry if needed
      // Server-specific configuration
      _experiments: {
        injectBuildId: true,
        projectRoot: __dirname,
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
    //minify: process.env.NODE_ENV === 'production' ? 'terser' : false,
    terserOptions: {
      mangle: false,
      keep_classnames: true,
      keep_fnames: true,
    },
  },
});

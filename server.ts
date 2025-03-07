// @ts-ignore
// Virtual entry point for the app
import * as remixBuild from 'virtual:remix/server-build';
import {storefrontRedirect} from '@shopify/hydrogen';
import type {ServerBuild} from '@shopify/remix-oxygen';
import {createRequestHandler} from '@shopify/remix-oxygen';
import {wrapRequestHandler} from '@sentry/cloudflare/request';
import {instrumentBuild} from '@sentry/remix/cloudflare';

import {createAppLoadContext} from '~/lib/context';

// Instrument your Remix build with Sentry
const instrumentedBuild = instrumentBuild(remixBuild) as unknown as ServerBuild;

/**
 * Export a fetch handler in module format.
 */
export default {
  async fetch(
    request: Request,
    env: Env,
    executionContext: ExecutionContext,
  ): Promise<Response> {
    try {
      const appLoadContext = await createAppLoadContext(
        request,
        env,
        executionContext,
      );

      /**
       * Create a Remix request handler and pass
       * Hydrogen's Storefront client to the loader context.
       */

      const handleRequest = createRequestHandler({
        build: instrumentedBuild,
        mode: process.env.NODE_ENV,
        getLoadContext: () => appLoadContext,
      });

      // Wrap the request handling with Sentry's wrapRequestHandler
      return wrapRequestHandler(
        {
          options: {
            dsn: 'https://96a191b37959bbcb1c18ef7909a9563c@o4508938145234944.ingest.de.sentry.io/4508938152902736',
            tracesSampleRate: 1.0,
          },
          request: request as any,
          context: executionContext,
        },
        async () => {
          const response = await handleRequest(request);

          if (appLoadContext.session.isPending) {
            response.headers.set(
              'Set-Cookie',
              await appLoadContext.session.commit(),
            );
          }

          if (response.status === 404) {
            /**
             * Check for redirects only when there's a 404 from the app.
             * If the redirect doesn't exist, then `storefrontRedirect`
             * will pass through the 404 response.
             */
            return storefrontRedirect({
              request,
              response,
              storefront: appLoadContext.storefront,
            });
          }

          return response;
        },
      );
    } catch (error) {
      console.error(error);
      return new Response('An unexpected error occurred', {status: 500});
    }
  },
};

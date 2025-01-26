// @ts-ignore
// Virtual entry point for the app
import * as remixBuild from 'virtual:remix/server-build';
import {storefrontRedirect} from '@shopify/hydrogen';
import {createRequestHandler} from '@shopify/remix-oxygen';
import {wrapRequestHandler} from '@sentry/cloudflare';

import {createAppLoadContext} from '~/lib/context';

/**
 * Export a fetch handler in module format.
 */
export default {
  async fetch(
    request: Request,
    env: Env,
    executionContext: ExecutionContext,
  ): Promise<Response> {
    return wrapRequestHandler(
      {
        options: {
          dsn: 'https://e3f54e7a380c9bd88a6c474f3b66fb60@o4508700259319808.ingest.de.sentry.io/4508700292677712',
          tracesSampleRate: 1.0,
        },
        // Need to cast to any because this is not on cloudflare
        request: request as any,
        context: executionContext,
      },
      async () => {
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
            build: remixBuild,
            mode: process.env.NODE_ENV,
            getLoadContext: () => appLoadContext,
          });

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
        } catch (error) {
          console.error(error);
          return new Response('An unexpected error occurred', {status: 500});
        }
      },
    );
  },
};

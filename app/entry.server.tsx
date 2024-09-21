import type {EntryContext, AppLoadContext} from '@shopify/remix-oxygen';
import {RemixServer} from '@remix-run/react';
import isbot from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {createContentSecurityPolicy} from '@shopify/hydrogen';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  context: AppLoadContext,
) {
  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    scriptSrc: [
      'self',
      'data:',
      '*.youtube.com',
      '*.youtu.be',
      '*.vimeo.com',
      '*.google.com',
      '*.google-analytics.com',
      'analytics.google.com',
      '*.googletagmanager.com',
      'cdn.alireviews.io',
      'cdn.jsdelivr.net',
      '*.alicdn.com',
      '*.shopify.com',
      'cdn.shopify.com',
      'localhost:3000',
    ],
    styleSrc: ['self', '*.shopify.com', 'cdn.shopify.com'],
    connectSrc: ['self', 'analytics.google.com', '*.shopify.com'],
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <RemixServer context={remixContext} url={request.url} />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        // eslint-disable-next-line no-console
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}

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
      //  '*.google.com',
      //  '*.google.com.ua',
      '*.google-analytics.com',
      '*.googletagmanager.com',
      '*.g.doubleclick.net',
      'cdn.alireviews.io',
      'cdn.jsdelivr.net',
      //  '*.shopify.com',
      'localhost:3000',
    ],
    styleSrc: ['self', '*.shopify.com', 'cdn.shopify.com'],
    connectSrc: [
      'self',
      'analytics.google.com',
      //  '*.google.com',
      //  '*.google.com.ua',
      '*.googleadservices.com',
      '*.googletagmanager.com',
      'pagead2.googlesyndication.com',
      '*.g.doubleclick.net',
      //  '*.shopify.com',
    ],
    imgSrc: [
      'self',
      //  'data:',
      //  '*.google.com',
      //  '*.google.com.ua',
      '*.googleadservices.com',
      '*.g.doubleclick.net',
      'pagead2.googlesyndication.com',
      //  '*.shopify.com',
      'localhost:3000',
    ],
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

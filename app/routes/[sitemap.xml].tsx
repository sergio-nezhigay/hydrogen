import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {getSitemapIndex} from '@shopify/hydrogen';

export async function loader({
  request,
  context: {storefront},
}: LoaderFunctionArgs) {
  const response = await getSitemapIndex({
    storefront,
    request,
    types: ['products', 'pages', 'collections', 'metaObjects', 'articles'],
  });

  response.headers.set('Cache-Control', `max-age=${60 * 60 * 24}`);

  return response;
}

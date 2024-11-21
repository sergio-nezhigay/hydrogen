import {unstable__getSitemap as getSitemap} from '@shopify/hydrogen';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

export async function loader({
  request,
  params,
  context: {storefront},
}: LoaderFunctionArgs) {
  const response = await getSitemap({
    storefront,
    request,
    params,
    locales: ['uk', 'ru'],
    getLink: ({type, baseUrl, handle, locale}) => {
      if (!locale || locale === 'uk') {
        return `${baseUrl}/${type}/${handle}`;
      }
      return `${baseUrl}/ru/${type}/${handle}`;
    },
  });
  response.headers.set('Cache-Control', `max-age=${60 * 60 * 24}`);

  return response;
}

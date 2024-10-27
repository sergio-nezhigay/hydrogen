import {unstable__getSitemap as getSitemap} from '@shopify/hydrogen';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

export async function loader({
  request,
  params,
  context: {storefront},
}: LoaderFunctionArgs) {
  console.log('Request received', {request, params});

  const response1 = await getSitemap({
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

  // Log the response before returning
  console.log('Generated Sitemap Response:', response.body);

  response.headers.set('Cache-Control', `max-age=${60 * 60 * 24}`);

  return response;
}

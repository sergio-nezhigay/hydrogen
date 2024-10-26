import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {unstable__getSitemap as getSitemap} from '@shopify/hydrogen';

export async function loader({
  request,
  params,
  context: {storefront},
}: LoaderFunctionArgs) {
  console.log('Request received', {request, params});

  const response = await getSitemap({
    storefront,
    request,
    params,
    locales: ['UK-UA', 'RU-UA'],
    getLink: ({type, baseUrl, handle, locale}) => {
      // Log the inputs to the getLink function
      console.log('Generating link for:', {type, baseUrl, handle, locale});

      // For 'UK-UA', no extra locale path (default base URL)
      if (locale === 'UK-UA') {
        const link = `${baseUrl}/${type}/${handle}`;
        console.log('Generated UK-UA link:', link);
        return link;
      }

      // For 'RU-UA', add '/ru' in the URL structure
      if (locale === 'RU-UA') {
        const link = `${baseUrl}/ru/${type}/${handle}`;
        console.log('Generated RU-UA link:', link);
        return link;
      }

      // Fallback in case of no locale
      const fallbackLink = `${baseUrl}/${type}/${handle}`;
      console.log('Fallback link:', fallbackLink);
      return fallbackLink;
    },
  });

  // Log the response before returning
  console.log('Generated Sitemap Response:', response);

  response.headers.set('Cache-Control', `max-age=${60 * 60 * 24}`);

  return response;
}

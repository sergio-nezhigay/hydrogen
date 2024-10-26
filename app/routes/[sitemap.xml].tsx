import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {getSitemap} from '@shopify/hydrogen';

export async function loader({storefront, request}: LoaderFunctionArgs) {
  const response = await getSitemap({
    storefront,
    request,
    params: {},
    locales: ['uk-UA', 'ru-UA'], // Ukrainian and Russian locales for Ukraine
    getLink: ({type, baseUrl, handle, locale}) => {
      if (!locale) return `${baseUrl}/${type}/${handle}`;
      return `${baseUrl}/${locale}/${type}/${handle}`; // Create URLs based on locale
    },
  });

  response.headers.set('Cache-Control', `max-age=${60 * 60 * 24}`);
  return response;
}

export default function Sitemap() {
  return null;
}

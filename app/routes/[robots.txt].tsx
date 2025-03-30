import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';

export const loader = ({request}: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  return new Response(robotsTxtData({url: url.origin}), {
    status: 200,
    headers: {
      'content-type': 'text/plain',
      // Cache for 24 hours
      'cache-control': `max-age=${60 * 60 * 24}`,
    },
  });
};

function robotsTxtData({url}: {url: string}) {
  const sitemapUrl = url ? `${url}/sitemap.xml` : undefined;

  const basePaths = [
    '/admin/*',
    '/cart/*',
    '/orders/*',
    '/checkouts/*',
    '/checkout/*',
    '/carts/*',
    '/account/*',
    '/search/*',
    '/tag/*',
    '/attrib/*',
    '/reviews/*',
  ];

  const disallowPaths = [
    ...basePaths,
    ...basePaths.map((path) => `/ru${path}`),
    '/ru/ru',
    '/*.atom',
    '/*checkout*',
  ];

  const disallowRules = disallowPaths
    .map((path) => `Disallow: ${path}`)
    .join('\n');

  return `
    User-agent: *
    ${disallowRules}
    ${sitemapUrl ? `Sitemap: ${sitemapUrl}` : ''}

    # Google adsbot ignores robots.txt unless specifically named!
    User-agent: adsbot-google
    ${disallowRules}
    `.trim();
}

import type {SeoConfig} from '@shopify/hydrogen';
import * as Sentry from '@sentry/browser';
import {
  useNonce,
  getShopAnalytics,
  Script,
  Analytics,
  getSeoMeta,
} from '@shopify/hydrogen';
import {
  defer,
  type MetaArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  useRouteError,
  useRouteLoaderData,
  isRouteErrorResponse,
  type ShouldRevalidateFunction,
  ScrollRestoration,
} from '@remix-run/react';
import {useEffect} from 'react';

import favicon from '~/assets/favicon.ico';
import tailwindCss from '~/styles/tailwind.css?url';
import {PageLayout} from '~/components/PageLayout';
import {HEADER_QUERY} from '~/lib/fragments';
import searchStyles from '~/styles/search.css?url';

//import {GoogleTagManager} from './modules/GoogleTagManager';
import {DEFAULT_LOCALE} from './lib/utils';
import {seoPayload} from './lib/seo.server';
import {GenericError} from './components/GenericError';
import {NotFound} from './components/NotFound';
import {CustomAnalytics} from './modules/CustomAnalytics';

export type RootLoader = typeof loader;

export const meta = ({data}: MetaArgs<typeof loader>) => {
  return getSeoMeta(data!.seo as SeoConfig);
};

/**
 * This is important to avoid re-fetching root queries on sub-navigations
 */
export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
  defaultShouldRevalidate,
}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') return true;

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) return true;

  return defaultShouldRevalidate;
};

export function links() {
  return [
    {rel: 'stylesheet', href: tailwindCss},
    {rel: 'stylesheet', href: searchStyles},
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },

    {rel: 'icon', type: 'image/x-icon', href: favicon},
  ];
}

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  const {storefront, env, customerAccount} = args.context;
  const isLoggedInPromise: Promise<boolean> = customerAccount.isLoggedIn();

  return defer({
    ...deferredData,
    ...criticalData,
    isLoggedIn: isLoggedInPromise,
    publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
    shop: getShopAnalytics({
      storefront,
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
    }),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      //  withPrivacyBanner: true,
      // localize the privacy banner
      country: args.context.storefront.i18n.country,
      language: args.context.storefront.i18n.language,
    },
    selectedLocale: storefront.i18n,
  });
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, request}: LoaderFunctionArgs) {
  const {storefront} = context;

  const [header] = await Promise.all([
    storefront.query(HEADER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        headerMenuHandle: 'main-menu', // Adjust to your header menu handle
      },
    }),
    // Add other queries here, so that they are loaded in parallel
    //getLayoutData(context),
  ]);
  const shop = header?.shop;
  const seo = seoPayload.root({shop, url: request.url});

  //  console.log(
  //    '===== LOG START =====',
  //    new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
  //  );
  //  console.log('header:', JSON.stringify(header, null, 4));
  return {header, seo};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  const {cart} = context;

  return {
    cart: cart.get(),
  };
}

export function Layout({children}: {children?: React.ReactNode}) {
  const nonce = useNonce();
  const data = useRouteLoaderData<RootLoader>('root');
  const language = (data?.consent.language ??
    DEFAULT_LOCALE.language) as string;

  return (
    <html lang={language}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        {/***********************************************/
        /**********  EXAMPLE UPDATE STARTS  ************/}
        {/*<Script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-WRQRP5RF');`,
          }}
        ></Script>*/}
        {/**********   EXAMPLE UPDATE END   ************/
        /***********************************************/}
      </head>
      <body>
        {/***********************************************/
        /**********  EXAMPLE UPDATE STARTS  ************/}
        {/*<noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WRQRP5RF"
            height="0"
            width="0"
            style={{
              display: 'none',
              visibility: 'hidden',
            }}
            title="GTM"
          ></iframe>
        </noscript>*/}
        {/**********   EXAMPLE UPDATE END   ************/
        /***********************************************/}
        {data ? (
          <Analytics.Provider
            cart={data.cart}
            shop={data.shop}
            consent={data.consent}
          >
            <PageLayout {...data}>{children}</PageLayout>
            <CustomAnalytics />
            {/***********************************************/
            /**********  EXAMPLE UPDATE STARTS  ************/}
            {/*<GoogleTagManager />*/}
            {/**********   EXAMPLE UPDATE END   ************/
            /***********************************************/}
          </Analytics.Provider>
        ) : (
          children
        )}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

// Initialize Sentry
if (typeof window !== 'undefined') {
  Sentry.init({
    dsn: 'https://e3f54e7a380c9bd88a6c474f3b66fb60@o4508700259319808.ingest.de.sentry.io/4508700292677712',
    tracesSampleRate: 1.0,
  });
}

export default function App() {
  useEffect(() => {
    // Add global error handler
    const handleError = (event: ErrorEvent) => {
      Sentry.captureException(event.error);
    };

    window.addEventListener('error', handleError);

    return () => window.removeEventListener('error', handleError);
  }, []);
  return <Outlet />;
}

export function ErrorBoundary({error}: {error: Error}) {
  Sentry.captureException(error);
  const routeError = useRouteError();
  const isRouteError = isRouteErrorResponse(routeError);
  const nonce = useNonce();

  let title = 'Error';
  let pageType = 'page';

  if (isRouteError) {
    title = 'Not found';
    if (routeError.status === 404) pageType = routeError.data || pageType;
  }

  return (
    <div>
      <h2>Something went wrong!</h2>

      {isRouteError ? (
        <>
          {routeError.status === 404 ? (
            <NotFound type={pageType} />
          ) : (
            <GenericError
              error={{message: `${routeError.status} ${routeError.data}`}}
            />
          )}
        </>
      ) : (
        <GenericError error={error instanceof Error ? error : undefined} />
      )}

      <ScrollRestoration nonce={nonce} />
      <Scripts nonce={nonce} />
    </div>
  );
}

const LAYOUT_QUERY = `#graphql
  query layout(
    $language: LanguageCode
    $headerMenuHandle: String!
  ) @inContext(language: $language) {
    #shop {
    #  ...Shop
    #}
    headerMenu: menu(handle: $headerMenuHandle) {
      ...Menu
    }
  }
#  fragment Shop on Shop {
#    id
#    name
#    description
#    primaryDomain {
#      url
#    }
#    brand {
#      logo {
#        image {
#          url
#        }
#      }
#    }
#  }
  fragment MenuItem on MenuItem {
    id
    resourceId
    tags
    title
    type
    url
  }
  fragment ChildMenuItem on MenuItem {
    ...MenuItem
  }
  fragment ParentMenuItem on MenuItem {
    ...MenuItem
    items {
      ...ChildMenuItem
    }
  }
  fragment Menu on Menu {
    id
    items {
      ...ParentMenuItem
    }
  }
` as const;

//async function getLayoutData({storefront, env}: AppLoadContext) {
//  const data = await storefront.query(LAYOUT_QUERY, {
//    cache: storefront.CacheLong(),
//    variables: {
//      headerMenuHandle: 'main-menu',
//      language: storefront.i18n.language,
//    },
//  });

//  invariant(data, 'No data returned from Shopify API');

//  /*
//      Modify specific links/routes (optional)
//      @see: https://shopify.dev/api/storefront/unstable/enums/MenuItemType
//      e.g here we map:
//        - /blogs/news -> /news
//        - /blog/news/blog-post -> /news/blog-post
//        - /collections/all -> /products
//    */
//  const customPrefixes = {BLOG: '', CATALOG: 'products'};

//  const headerMenu = data?.headerMenu
//    ? parseMenu(
//        data.headerMenu,
//        data.shop.primaryDomain.url,
//        env,
//        customPrefixes,
//      )
//    : undefined;

//  return {shop: data.shop, headerMenu};
//}

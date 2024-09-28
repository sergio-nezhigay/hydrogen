import {
  useNonce,
  getShopAnalytics,
  Analytics,
  getSeoMeta,
  SeoConfig,
} from '@shopify/hydrogen';
import {
  AppLoadContext,
  defer,
  MetaArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  useRouteError,
  useRouteLoaderData,
  ScrollRestoration,
  isRouteErrorResponse,
  type ShouldRevalidateFunction,
} from '@remix-run/react';
import favicon from '~/assets/favicon.svg';
import resetStyles from '~/styles/reset.css?url';
import tailwindCss from './styles/tailwind.css?url';
import appStyles from '~/styles/app.css?url';
import {PageLayout} from '~/components/PageLayout';
import {HEADER_QUERY} from '~/lib/fragments';
import {CustomAnalytics} from './modules/CustomAnalytics';
import {DEFAULT_LOCALE, parseMenu} from './lib/utils';
import {seoPayload} from './lib/seo.server';

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
    {rel: 'stylesheet', href: resetStyles},
    {rel: 'stylesheet', href: tailwindCss},
    {rel: 'stylesheet', href: appStyles},
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {rel: 'icon', type: 'image/svg+xml', href: favicon},
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
      </head>
      <body>
        {data ? (
          <Analytics.Provider
            cart={data.cart}
            shop={data.shop}
            consent={data.consent}
          >
            <PageLayout {...data}>{children}</PageLayout>
            <CustomAnalytics />
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

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  let errorMessage = 'Unknown error';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="route-error">
      <h1>Oops</h1>
      <h2>{errorStatus}</h2>
      {errorMessage && (
        <fieldset>
          <pre>{errorMessage}</pre>
        </fieldset>
      )}
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

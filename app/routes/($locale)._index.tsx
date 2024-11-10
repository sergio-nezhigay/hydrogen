import {
  defer,
  type MetaArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {Suspense} from 'react';
import {Await, useLoaderData} from '@remix-run/react';
import {getSeoMeta} from '@shopify/hydrogen';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';

import {ProductSwimlane} from '~/components/ProductSwimlane';
import {PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';
import {Skeleton} from '~/components/Skeleton';
import {BrandSwimlane} from '~/modules/BrandSwimlane';
import {getAllShopReviews} from '~/lib/judgeme';
import {ReviewSwimlane} from '~/modules/ReviewSwimlane';
import {HeroSection} from '~/modules/Hero';
import CollectionSwimLine from '~/modules/CollectionSwimLine';
import {homepageCollectionIDs} from '~/data/homepageCollectionIDs';

export const headers = routeHeaders;

export async function loader(args: LoaderFunctionArgs) {
  const {params, context} = args;
  const {language} = context.storefront.i18n;

  if (
    params.locale &&
    params.locale.toLowerCase() !== `${language}`.toLowerCase()
  ) {
    // If the locale URL param is defined, yet we still are on `EN-US`
    // the the locale param must be invalid, send to the 404 page
    throw new Response(null, {status: 404});
  }

  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, request}: LoaderFunctionArgs) {
  return {
    seo: seoPayload.home({url: request.url}),
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  const {language, country} = context.storefront.i18n;

  const featuredProducts = context.storefront
    .query(HOMEPAGE_FEATURED_PRODUCTS_QUERY, {
      variables: {
        /**
         * Country and language properties are automatically injected
         * into all queries. Passing them is unnecessary unless you
         * want to override them from the following default:
         */
        country,
        language,
      },
    })
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render

      console.error(error);
      return null;
    });

  const featuredCollections = context.storefront
    .query(HOMEPAGE_FEATURED_COLLECTIONS_QUERY, {
      variables: {
        country,
        language,
        ids: homepageCollectionIDs,
      },
    })
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render

      console.error(error);
      return null;
    });

  const shopReviews = getAllShopReviews(
    context.env.JUDGEME_PUBLIC_TOKEN,
    context.env.PUBLIC_STORE_DOMAIN,
  ).catch((error) => {
    console.error('Error fetching shop reviews:', error);
    return null;
  });

  return {
    featuredProducts,
    featuredCollections,
    shopReviews,
  };
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function Homepage() {
  const {featuredCollections, featuredProducts, shopReviews} =
    useLoaderData<typeof loader>();

  return (
    <>
      <HeroSection />
      <BrandSwimlane />

      {featuredCollections && (
        <Suspense fallback={<p></p>}>
          <Await resolve={featuredCollections}>
            {(response) => {
              const collections = response?.nodes || [];
              if (!collections || collections?.length === 0) {
                return <span>Collections loading error</span>;
              }
              return collections.length > 0 ? (
                <CollectionSwimLine collections={collections as Collection[]} />
              ) : (
                <Skeleton className="my-4 w-full h-[300px]" />
              );
            }}
          </Await>
        </Suspense>
      )}

      {featuredProducts && (
        <Suspense fallback={<p></p>}>
          <Await resolve={featuredProducts}>
            {(response) => {
              return response?.products?.nodes ? (
                <div className="bg-gray-50">
                  <ProductSwimlane products={response.products} />
                </div>
              ) : (
                <Skeleton className="my-4 w-full h-[300px]" />
              );
            }}
          </Await>
        </Suspense>
      )}

      {shopReviews && (
        <Suspense
          fallback={
            <Skeleton className="my-4 w-full h-[300px]">
              Loading Reviews...
            </Skeleton>
          }
        >
          <Await resolve={shopReviews}>
            {(reviews) => {
              if (!reviews) {
                return <span>Review loading error</span>;
              }
              return <ReviewSwimlane reviews={reviews} />;
            }}
          </Await>
        </Suspense>
      )}
    </>
  );
}

export const HOMEPAGE_FEATURED_PRODUCTS_QUERY = `#graphql
  query homepageFeaturedProducts($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    products(first: 8, query: "available_for_sale:true") {
      nodes {
        ...ProductCard
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;

// @see: https://shopify.dev/api/storefront/current/queries/collections
export const HOMEPAGE_FEATURED_COLLECTIONS_QUERY = `#graphql
  query homepageFeaturedCollections($country: CountryCode, $language: LanguageCode, $ids: [ID!]!)
  @inContext(country: $country, language: $language) {
    nodes(ids: $ids) {
      id
      ... on Collection {
        id
        title
        handle
        image {
          altText
          width
          height
          url
        }
      }
    }
  }
` as const;

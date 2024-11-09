import {
  defer,
  type MetaArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {Suspense} from 'react';
import {Await, useLoaderData} from '@remix-run/react';
import {getSeoMeta} from '@shopify/hydrogen';

import {ProductSwimlane} from '~/components/ProductSwimlane';
import {MEDIA_FRAGMENT, PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';
import {Skeleton} from '~/components/Skeleton';
import {BrandSwimlane} from '~/modules/BrandSwimlane';
import {getAllShopReviews} from '~/lib/judgeme';
import {ReviewSwimlane} from '~/modules/ReviewSwimlane';
import {HeroSection} from '~/modules/Hero';
import CollectionSwimLine from '~/modules/CollectionSwimLine';
import type {HomepageFeaturedCollectionsQuery} from 'storefrontapi.generated';

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

  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, request}: LoaderFunctionArgs) {
  const [{shop, hero}] = await Promise.all([
    context.storefront.query(HOMEPAGE_SEO_QUERY, {
      variables: {handle: 'freestyle'},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {
    shop,
    primaryHero: hero,
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
  const collectionIds = [
    'gid://shopify/Collection/496623714620',
    'gid://shopify/Collection/496623943996',
    'gid://shopify/Collection/496624271676',
    'gid://shopify/Collection/496623518012',
    'gid://shopify/Collection/497045635388',
    'gid://shopify/Collection/496624730428',
    'gid://shopify/Collection/496623911228',
    'gid://shopify/Collection/496623780156',
  ];
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
        ids: collectionIds,
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
    10, // perPage
    33, // page
  ).catch((error) => {
    console.error('Error fetching shop reviews:', error);
    return null;
  });

  return {
    featuredProducts,
    featuredCollections,
    shopReviews,
    //language,
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
      {featuredCollections && (
        <Suspense fallback={<p></p>}>
          <Await resolve={featuredCollections}>
            {(response) => {
              const collections = response?.nodes || [];
              if (collections.length === 0) {
                return <span>Collections loading error</span>;
              }
              return collections.length > 0 ? (
                <CollectionSwimLine collections={collections} />
              ) : (
                <Skeleton className="my-4 w-full h-[300px]" />
              );
            }}
          </Await>
        </Suspense>
      )}
      <BrandSwimlane />
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

const COLLECTION_CONTENT_FRAGMENT = `#graphql
  fragment CollectionContent on Collection {
    id
    handle
    title
    descriptionHtml
    heading: metafield(namespace: "hero", key: "title") {
      value
    }
    byline: metafield(namespace: "hero", key: "byline") {
      value
    }
    cta: metafield(namespace: "hero", key: "cta") {
      value
    }
    spread: metafield(namespace: "hero", key: "spread") {
      reference {
        ...Media
      }
    }
    spreadSecondary: metafield(namespace: "hero", key: "spread_secondary") {
      reference {
        ...Media
      }
    }
  }
  ${MEDIA_FRAGMENT}
` as const;

const HOMEPAGE_SEO_QUERY = `#graphql
  query seoCollectionContent($handle: String, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    hero: collection(handle: $handle) {
      ...CollectionContent
    }
    shop {
      name
      description
    }
  }
  ${COLLECTION_CONTENT_FRAGMENT}
` as const;

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

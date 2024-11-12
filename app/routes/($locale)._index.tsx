import {
  defer,
  type MetaArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {Suspense} from 'react';
import {Await, useLoaderData} from '@remix-run/react';
import {getSeoMeta} from '@shopify/hydrogen';

import {ProductSwimlane} from '~/components/ProductSwimlane';
import {PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';
import {Skeleton} from '~/components/Skeleton';
import {BrandSwimlane} from '~/modules/BrandSwimlane';
import {getAllShopReviews} from '~/lib/judgeme';
import {ReviewSwimlane} from '~/modules/ReviewSwimlane';
import {HeroSection} from '~/modules/Hero';
import CollectionLine from '~/modules/CollectionLine';
import BannerLine from '~/components/BannerLine';
import {ServiceInfo} from '~/modules/ServiceInfo';

export const headers = routeHeaders;

export async function loader(args: LoaderFunctionArgs) {
  const {params, context} = args;
  const {language} = context.storefront.i18n;

  if (
    params.locale &&
    params.locale.toLowerCase() !== `${language}`.toLowerCase()
  ) {
    throw new Response(null, {status: 404});
  }

  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

async function loadCriticalData({context, request}: LoaderFunctionArgs) {
  return {
    seo: seoPayload.home({url: request.url}),
  };
}

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

  const shopReviews = getAllShopReviews(
    context.env.JUDGEME_PUBLIC_TOKEN,
    context.env.PUBLIC_STORE_DOMAIN,
  ).catch((error) => {
    console.error('Error fetching shop reviews:', error);
    return null;
  });

  return {
    featuredProducts,
    shopReviews,
  };
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function Homepage() {
  const {featuredProducts, shopReviews} = useLoaderData<typeof loader>();

  return (
    <>
      <HeroSection />
      <ServiceInfo />
      <BannerLine />
      <CollectionLine />

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

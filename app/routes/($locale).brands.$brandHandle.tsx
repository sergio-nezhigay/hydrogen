import {
  type MetaArgs,
  type LoaderFunctionArgs,
  defer,
} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import invariant from 'tiny-invariant';
import {
  Pagination,
  getPaginationVariables,
  getSeoMeta,
} from '@shopify/hydrogen';

import {Section} from '~/components/Text';
import {ProductCard} from '~/components/ProductCard';
import {Grid} from '~/components/Grid';
import {PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {getImageLoadingPriority} from '~/lib/const';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';
import {useTranslation} from '~/lib/utils';
import type {AllBrandedProductsQuery} from 'storefrontapi.generated';

const PAGE_BY = 14;

export const headers = routeHeaders;

export async function loader({
  params,
  request,
  context: {storefront},
}: LoaderFunctionArgs) {
  const variables = getPaginationVariables(request, {pageBy: PAGE_BY});
  const {brandHandle} = params;

  invariant(brandHandle, 'Missing brandHandle param');

  const data: AllBrandedProductsQuery = await storefront.query(
    ALL_BRANDED_PRODUCTS_QUERY,
    {
      variables: {
        ...variables,
        country: storefront.i18n.country,
        language: storefront.i18n.language,
        brand: `inventory_total:>=1 AND vendor:${brandHandle}`,
      },
    },
  );

  invariant(data, 'No data returned from Shopify API');

  const seo = seoPayload.noindex({
    url: request.url,
    title: 'Каталог ' + brandHandle,
    description: 'Усі товари' + brandHandle,
  });

  return defer({
    products: data.products,
    seo,
    brandHandle,
  });
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function AllProducts() {
  const {products, brandHandle} = useLoaderData<typeof loader>();
  const {translation} = useTranslation();
  const heading = 'Каталог ' + brandHandle;

  return (
    <>
      <Section heading={heading} headingClassName="capitalize">
        <Pagination connection={products}>
          {({nodes, isLoading, NextLink, PreviousLink}) => {
            const itemsMarkup = nodes.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                loading={getImageLoadingPriority(i)}
              />
            ));

            return (
              <>
                <div className="flex items-center justify-center mt-6">
                  <PreviousLink className="inline-block rounded font-medium text-center py-3 px-6 border border-primary/10 bg-contrast text-inherit  w-full">
                    {isLoading ? translation.loading : translation.prev}
                  </PreviousLink>
                </div>
                <Grid data-test="product-grid">{itemsMarkup}</Grid>
                <div className="flex items-center justify-center mt-6">
                  <NextLink className="inline-block rounded font-medium text-center py-3 px-6 border border-primary/10 bg-contrast text-inherit w-full">
                    {isLoading ? translation.loading : translation.next}
                  </NextLink>
                </div>
              </>
            );
          }}
        </Pagination>
      </Section>
    </>
  );
}

const ALL_BRANDED_PRODUCTS_QUERY = `#graphql
    query AllBrandedProducts(
      $country: CountryCode
      $language: LanguageCode
      $first: Int
      $last: Int
      $startCursor: String
      $endCursor: String
      $brand: String
    ) @inContext(country: $country, language: $language) {
      products(first: $first, query: $brand, last: $last, before: $startCursor, after: $endCursor,  ) {
        nodes {
          ...ProductCard
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          startCursor
          endCursor
        }
      }
    }
    ${PRODUCT_CARD_FRAGMENT}
  ` as const;

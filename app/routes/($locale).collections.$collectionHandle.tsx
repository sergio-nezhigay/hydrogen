import {type MetaArgs, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {useInView} from 'react-intersection-observer';
import type {
  Filter,
  ProductCollectionSortKeys,
  ProductFilter,
} from '@shopify/hydrogen/storefront-api-types';
import {
  getPaginationVariables,
  Analytics,
  getSeoMeta,
  Pagination,
} from '@shopify/hydrogen';
import invariant from 'tiny-invariant';

import {Section} from '~/components/Text';
import {Grid} from '~/components/Grid';
import {Button} from '~/components/Button';
import {ProductCard} from '~/components/ProductCard';
import {SortFilter, type SortParam} from '~/components/SortFilter';
import {PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {routeHeaders} from '~/data/cache';
import {seoPayload} from '~/lib/seo.server';
import {FILTER_URL_PREFIX} from '~/components/SortFilter';
import {getImageLoadingPriority} from '~/lib/const';
import {cn, parseAsCurrency, useTranslation} from '~/lib/utils';
import {navigationMenuTriggerStyle} from '~/components/ui/navigation-menu';

export const headers = routeHeaders;

export const handle = {
  breadcrumbType: 'collection',
};

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 19,
  });
  const {collectionHandle} = params;
  const locale = context.storefront.i18n;

  invariant(collectionHandle, 'Missing collectionHandle param');

  const searchParams = new URL(request.url).searchParams;

  const {sortKey, reverse} = getSortValuesFromParam(
    searchParams.get('sort') as SortParam,
  );
  const filters = [...searchParams.entries()].reduce(
    (filters, [key, value]) => {
      if (key.startsWith(FILTER_URL_PREFIX)) {
        const filterKey = key.substring(FILTER_URL_PREFIX.length);
        let parsedValue;

        try {
          parsedValue = JSON.parse(value);
        } catch (error) {
          console.error(
            `Failed to parse filter value for key ${filterKey}:`,
            error,
          );
          parsedValue = value;
        }

        filters.push({
          [filterKey]: parsedValue,
        });
      }
      return filters;
    },
    [] as ProductFilter[],
  );

  filters.push({
    available: true,
  });

  const {collection} = await context.storefront.query(COLLECTION_QUERY, {
    variables: {
      ...paginationVariables,
      handle: collectionHandle,
      filters,
      sortKey,
      reverse,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  if (!collection) {
    throw new Response('collection', {status: 404});
  }

  const seo = seoPayload.collection({collection, url: request.url});

  const allFilterValues = collection.products.filters.flatMap(
    (filter) => filter.values,
  );

  const appliedFilters = filters
    .map((filter) => {
      const foundValue = allFilterValues.find((value) => {
        const valueInput = JSON.parse(value.input as string) as ProductFilter;
        // special case for price, the user can enter something freeform (still a number, though)
        // that may not make sense for the locale/currency.
        // Basically just check if the price filter is applied at all.
        if (valueInput.price && filter.price) {
          return true;
        }
        return (
          // This comparison should be okay as long as we're not manipulating the input we
          // get from the API before using it as a URL param.
          JSON.stringify(valueInput) === JSON.stringify(filter)
        );
      });
      if (!foundValue) {
        console.error('Could not find filter value for filter', filter);
        return null;
      }

      if (foundValue.id === 'filter.v.price') {
        // Special case for price, we want to show the min and max values as the label.
        const input = JSON.parse(foundValue.input as string) as ProductFilter;
        const min = parseAsCurrency(input.price?.min ?? 0, locale);
        const max = input.price?.max
          ? parseAsCurrency(input.price.max, locale)
          : '';
        const label = min && max ? `${min} - ${max}` : 'Price';

        return {
          filter,
          label,
        };
      }
      return {
        filter,
        label: foundValue.label,
      };
    })
    .filter((filter): filter is NonNullable<typeof filter> => filter !== null);

  return {
    collection,
    appliedFilters,
    //collections: flattenConnection(collections),
    seo,
  };
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function Collection() {
  const {collection, appliedFilters} = useLoaderData<typeof loader>();
  const {translation} = useTranslation();
  const {ref, inView} = useInView();
  const buttonsClass = cn(
    navigationMenuTriggerStyle(),
    'flex items-center justify-center mx-auto p-0 bg-gray-900/10',
  );

  return (
    <>
      <Section
        padding="y"
        heading={collection.title}
        useH1
        display="flex"
        className="pt-0"
        headingClassName="!py-1"
      >
        {/*{collection.products.nodes.length > 0 ? (*/}
        <SortFilter
          filters={(collection.products.filters as Filter[]).filter(
            ({id}) => !id.includes('availability'),
          )}
          appliedFilters={appliedFilters.filter(
            ({filter}) => !filter.available,
          )}
        >
          <Pagination connection={collection.products}>
            {({
              nodes,
              isLoading,
              PreviousLink,
              NextLink,
              nextPageUrl,
              hasNextPage,
              state,
            }) => (
              <>
                <div
                  className={cn(
                    buttonsClass,
                    collection.products.pageInfo.hasPreviousPage
                      ? 'my-5'
                      : 'my-0 h-5',
                  )}
                >
                  <Button as={PreviousLink} variant="secondary" width="full">
                    {isLoading ? translation.loading : translation.prev}
                  </Button>
                </div>
                <ProductsLoadedOnScroll
                  nodes={nodes}
                  inView={inView}
                  nextPageUrl={nextPageUrl}
                  hasNextPage={hasNextPage}
                  state={state}
                />
                <div className={cn(buttonsClass, 'my-10')}>
                  <Button
                    ref={ref}
                    as={NextLink}
                    variant="secondary"
                    width="full"
                  >
                    {isLoading ? translation.loading : translation.next}
                  </Button>
                </div>
              </>
            )}
          </Pagination>
        </SortFilter>
        {/*) : (
          ''
        )}*/}
      </Section>
      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </>
  );
}

function ProductsLoadedOnScroll({
  nodes,
  inView,
  nextPageUrl,
  hasNextPage,
  state,
}: {
  nodes: any;
  inView: boolean;
  nextPageUrl: string;
  hasNextPage: boolean;
  state: any;
}) {
  //  in-view-based pagination
  //
  //  const navigate = useNavigate();
  //  useEffect(() => {
  //    if (inView && hasNextPage) {
  //      navigate(nextPageUrl, {
  //        replace: true,
  //        preventScrollReset: true,
  //        state,
  //      });
  //    }
  //  }, [inView, navigate, state, nextPageUrl, hasNextPage]);

  return (
    <Grid layout="products" data-test="product-grid">
      {nodes.map((product: any, i: number) => (
        <ProductCard
          key={product.id}
          product={product}
          loading={getImageLoadingPriority(i)}
        />
      ))}
    </Grid>
  );
}

const COLLECTION_QUERY = `#graphql
  query CollectionDetails(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $filters: [ProductFilter!]
    $sortKey: ProductCollectionSortKeys!
    $reverse: Boolean
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      seo {
        description
        title
      }

      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor,
        filters: $filters,
        sortKey: $sortKey,
        reverse: $reverse
      ) {
        filters {
          id
          label
          type
          values {
            id
            label
            count
            input
          }
        }
        nodes {
          ...ProductCard
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
    collections(first: 100) {
      edges {
        node {
          title
          handle
        }
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;

function getSortValuesFromParam(sortParam: SortParam | null): {
  sortKey: ProductCollectionSortKeys;
  reverse: boolean;
} {
  switch (sortParam) {
    case 'price-high-low':
      return {
        sortKey: 'PRICE',
        reverse: true,
      };
    case 'price-low-high':
      return {
        sortKey: 'PRICE',
        reverse: false,
      };
    //case 'best-selling':
    //  return {
    //    sortKey: 'BEST_SELLING',
    //    reverse: false,
    //  };
    //case 'newest':
    //  return {
    //    sortKey: 'CREATED',
    //    reverse: true,
    //  };
    //case 'featured':
    //  return {
    //    sortKey: 'MANUAL',
    //    reverse: false,
    //  };
    default:
      return {
        sortKey: 'BEST_SELLING',
        reverse: false,
      };
  }
}

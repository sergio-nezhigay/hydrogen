import {type MetaArgs, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';
import {
  Image,
  Pagination,
  getPaginationVariables,
  getSeoMeta,
} from '@shopify/hydrogen';

import {Grid} from '~/components/Grid';
import {Heading, Section} from '~/components/Text';
import {Link} from '~/components/Link';
import {Button} from '~/components/Button';
import {getImageLoadingPriority} from '~/lib/const';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';
import {cn, useTranslation} from '~/lib/utils';
import {navigationMenuTriggerStyle} from '~/components/ui/navigation-menu';

const PAGINATION_SIZE = 4;

export const headers = routeHeaders;

export const handle = {
  breadcrumbType: 'collections',
};

export const loader = async ({
  request,
  context: {storefront},
}: LoaderFunctionArgs) => {
  const variables = getPaginationVariables(request, {pageBy: PAGINATION_SIZE});
  const {collections} = await storefront.query(COLLECTIONS_QUERY, {
    variables: {
      ...variables,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });

  const seo = seoPayload.listCollections({
    collections,
    url: request.url,
  });

  return {collections, seo};
};

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function Collections() {
  const {collections} = useLoaderData<typeof loader>();
  const {translation} = useTranslation();

  return (
    <Section
      heading={translation.collections}
      headingClassName="text-center mx-auto"
      padding="y"
      useH1
      className="py-8"
    >
      <Pagination connection={collections}>
        {({nodes, isLoading, PreviousLink, NextLink}) => (
          <>
            <div className="flex items-center justify-center mb-6">
              <Button as={PreviousLink} variant="secondary" width="full">
                {isLoading ? translation.loading : translation.prev}
              </Button>
            </div>
            <Grid data-test="collection-grid">
              {nodes.map((collection, i) => (
                <CollectionCard
                  collection={collection as Collection}
                  key={collection.id}
                  loading={getImageLoadingPriority(i, 2)}
                />
              ))}
            </Grid>
            <div
              className={cn(
                navigationMenuTriggerStyle(),
                `mx-auto flex items-center justify-center mt-6`,
              )}
            >
              <Button as={NextLink} variant="secondary" width="full">
                {isLoading ? translation.loading : translation.next}
              </Button>
            </div>
          </>
        )}
      </Pagination>
    </Section>
  );
}

function CollectionCard({
  collection,
  loading,
}: {
  collection: Collection;
  loading?: HTMLImageElement['loading'];
}) {
  return (
    <Link
      prefetch="intent"
      to={`/collections/${collection.handle}`}
      className="grid gap-4"
    >
      <div className="card-image bg-primary/5 aspect-[3/2]">
        {collection?.image && (
          <Image
            data={collection.image}
            aspectRatio="6/4"
            sizes="(max-width: 32em) 100vw, 45vw"
            loading={loading}
          />
        )}
      </div>
      <Heading as="h3" size="copy">
        {collection.title}
      </Heading>
    </Link>
  );
}

const COLLECTIONS_QUERY = `#graphql
  query Collections(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        id
        title
        description
        handle
        seo {
          description
          title
        }
        image {
          id
          url
          width
          height
          altText
        }
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
`;

import {Image} from '@shopify/hydrogen';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';

import {Heading, Section} from '~/components/Text';
import {Grid} from '~/components/Grid';
import {Link} from '~/components/Link';
import {useTranslation} from '~/lib/utils';
import type {
  HomepageFeaturedCollectionsQuery,
  //  Collection,
} from 'storefrontapi.generated';

type FeaturedCollectionsProps = HomepageFeaturedCollectionsQuery & {
  title?: string;
};

// Type guard to check if the node is a Collection
function isCollection(node: any): node is Collection {
  return node && typeof node.handle === 'string' && node.image;
}

export function FeaturedCollections({
  title = 'trending_collections',
  nodes,
  ...props
}: FeaturedCollectionsProps) {
  const {t} = useTranslation();

  // Filter out any non-collections or collections without images
  const collectionsWithImage = nodes?.filter(isCollection) || [];

  if (collectionsWithImage.length === 0) {
    return null; // If none of the collections have images, don't render anything.
  }

  return (
    <Section {...props} heading={t(title)} padding="y">
      <Grid items={collectionsWithImage.length}>
        {collectionsWithImage.map((collection) => (
          <Link
            key={collection.id}
            to={`/collections/${collection.handle}`}
            prefetch="viewport"
            className="group"
          >
            <div className="grid gap-4">
              <div className="card-image bg-primary/5 aspect-[3/2] group-hover:shadow-hover transition-shadow duration-300">
                {collection?.image && (
                  <Image
                    alt={`Image of ${collection.title}`}
                    data={collection.image}
                    sizes="(max-width: 768px) 100vw, (max-width: 768px) 33vw, 20vw"
                    aspectRatio="3/2"
                  />
                )}
              </div>
              <Heading
                size="copy"
                className="transition-colors duration-300 group-hover:text-indigo-600 group-hover:underline"
              >
                {collection.title}
              </Heading>
            </div>
          </Link>
        ))}
      </Grid>
    </Section>
  );
}

import {Image} from '@shopify/hydrogen';

import type {HomepageFeaturedCollectionsQuery} from 'storefrontapi.generated';
import {Heading, Section} from '~/components/Text';
import {Grid} from '~/components/Grid';
import {Link} from '~/components/Link';
import {useTranslation} from '~/lib/utils';

type FeaturedCollectionsProps = HomepageFeaturedCollectionsQuery & {
  title?: string;
  [key: string]: any;
};

export function FeaturedCollections({
  collections,
  title = 'trending_collections',
  ...props
}: FeaturedCollectionsProps) {
  const {t} = useTranslation();

  const haveCollections = collections?.nodes?.length > 0;
  if (!haveCollections) return null;

  const collectionsWithImage = collections.nodes.filter((item) => item.image);

  return (
    <Section {...props} heading={t(title)} padding="y">
      <Grid items={collectionsWithImage.length}>
        {collectionsWithImage.map((collection) => {
          return (
            <Link
              key={collection.id}
              to={`/collections/${collection.handle}`}
              prefetch="viewport"
              className="group "
            >
              <div className="grid gap-4">
                <div className="card-image bg-primary/5 aspect-[3/2] group-hover:shadow-hover transition-shadow duration-300">
                  {collection?.image && (
                    <Image
                      alt={`Image of ${collection.title}`}
                      data={collection.image}
                      sizes="(max-width: 32em) 100vw, 33vw"
                      aspectRatio="3/2"
                    />
                  )}
                </div>
                <Heading
                  size="copy"
                  className="transition-colors duration-300  group-hover:text-indigo-600 group-hover:underline"
                >
                  {collection.title}
                </Heading>
              </div>
            </Link>
          );
        })}
      </Grid>
    </Section>
  );
}

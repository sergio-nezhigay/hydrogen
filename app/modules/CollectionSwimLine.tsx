import {Image} from '@shopify/hydrogen';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';

import {Link} from '~/components/Link';
import {Section} from '~/components/Text';

import {Gallery} from './Gallery';

function CollectionSwimLine({collections}: {collections: Collection[]}) {
  return (
    <Section
      padding="y"
      display="flex"
      className="flex flex-col bg-gray-50"
      heading="Популярні групи товарів"
    >
      <Gallery
        galleryItems={collections as Collection[]}
        GalleryItemComponent={CollectionCard}
        itemClasses="sm-max:pl-12 sm-max:basis-1/2 md:pl-[30px] md:flex-[0_0_184px] lg:flex-[0_0_124px] xl:flex-[0_0_156px] 2xl:flex-[0_0_196px]"
      />
    </Section>
  );
}

export default CollectionSwimLine;

export interface CollectionCardProps {
  itemData: Collection;
}

function CollectionCard({itemData}: CollectionCardProps) {
  return (
    <div className=" w-full">
      <Link
        to={`/collections/${itemData.handle}`}
        className="w-full card-image aspect-square !rounded-full overflow-hidden mb-2 block group"
      >
        {itemData?.image && (
          <Image
            alt={`Image of ${itemData.title}`}
            data={itemData.image}
            sizes="(max-width: 768px) 100vw, (max-width: 768px) 33vw, 20vw"
            aspectRatio="1/1"
            className="group-hover:bg-gray-200 bg-white w-full h-full object-contain"
          />
        )}
      </Link>

      <h3 className="text-center">{itemData.title}</h3>
    </div>
  );
}

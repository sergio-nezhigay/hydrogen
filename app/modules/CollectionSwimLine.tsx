import {Image} from '@shopify/hydrogen';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';

import {Link} from '~/components/Link';
import {Section} from '~/components/Text';

import DynamicGallery from './DynamicGallery';

function CollectionSwimLine({collections}: {collections: Collection[]}) {
  return (
    <Section
      padding="y"
      display="flex"
      className="flex flex-col bg-gray-50"
      heading="Популярні групи товарів"
    >
      <DynamicGallery
        data={collections as Collection[]}
        presentationComponent={CollectionCard}
        itemStyle="sm-max:pl-12 sm-max:basis-1/2 md:pl-[30px] md:flex-[0_0_184px] lg:flex-[0_0_124px] xl:flex-[0_0_156px] 2xl:flex-[0_0_196px]"
      />
    </Section>
  );
}

export default CollectionSwimLine;

export interface CollectionCardProps {
  item: Collection;
}

function CollectionCard({item}: CollectionCardProps) {
  return (
    <div className=" w-full">
      <Link
        to={`/collections/${item.handle}`}
        className="w-full card-image aspect-square !rounded-full overflow-hidden mb-2 block group"
      >
        {item?.image && (
          <Image
            alt={`Image of ${item.title}`}
            data={item.image}
            sizes="(max-width: 768px) 100vw, (max-width: 768px) 33vw, 20vw"
            aspectRatio="1/1"
            className="group-hover:bg-gray-200 bg-white w-full h-full object-contain"
          />
        )}
      </Link>

      <h3 className="text-center">{item.title}</h3>
    </div>
  );
}

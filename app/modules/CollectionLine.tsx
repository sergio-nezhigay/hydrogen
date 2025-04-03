import {Image} from '@shopify/hydrogen';

import {Link} from '~/components/Link';
import type {CollectionProps} from '~/data/homeCollections';
import {homeCollections} from '~/data/homeCollections';
import {useTranslation} from '~/lib/utils';
import {Section} from '~/components/Text';

import DynamicGallery from './DynamicGallery';

function CollectionLine() {
  return (
    <Section
      padding="y"
      display="flex"
      className="flex flex-col bg-gray-50"
      heading="Популярні групи товарів"
    >
      <DynamicGallery
        data={homeCollections}
        presentationComponent={CollectionCard}
        itemStyle="sm-max:pl-12 sm-max:basis-1/2 md:pl-[30px] md:flex-[0_0_184px] lg:flex-[0_0_124px] xl:flex-[0_0_156px] 2xl:flex-[0_0_196px]"
      />
    </Section>
  );
}

interface CollectionCardProps {
  item: CollectionProps;
  index: number;
}

function CollectionCard({item, index}: CollectionCardProps) {
  const {t} = useTranslation();
  const title = t(item.title);
  return (
    <div className=" w-full">
      <Link
        to={`/collections/${item.handle}`}
        className="w-full card-image aspect-square !rounded-full overflow-hidden mb-2 block group"
      >
        {item.imageSrc && (
          <Image
            alt={title}
            src={item.imageSrc}
            sizes="(min-width: 1024px) 13vw, (min-width: 768px) 25vw, 50vw"
            aspectRatio="1/1"
            className="group-hover:bg-gray-200 bg-white w-full h-full object-contain"
          />
        )}
      </Link>

      <h3 className="text-center">{title}</h3>
    </div>
  );
}

export default CollectionLine;

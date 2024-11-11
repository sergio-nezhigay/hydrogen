import {Image} from '@shopify/hydrogen';

import {Section} from '~/components/Text';
import {useTranslation} from '~/lib/utils';
import {Link} from '~/components/Link';
import {homepageBrands} from '~/data/homepageBrands';

import DynamicGallery from './DynamicGallery';

type Brand = {id: string; src: string; alt: string};

type BrandSwimlaneProps = {
  title?: string;
  brands?: {nodes: Brand[]};
};

export function BrandSwimlane({
  title = 'featured_brands',
  brands = homepageBrands,
}: BrandSwimlaneProps) {
  const {t} = useTranslation();
  const translatedTitle = t(title);

  return (
    <Section
      heading={translatedTitle}
      padding="y"
      display="flex"
      className="flex flex-col bg-gray-50"
    >
      <DynamicGallery
        data={brands.nodes}
        presentationComponent={BrandCardWrapper}
        itemStyle="pl-4 py-4 basis-1/2 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
      />
    </Section>
  );
}

export type BrandCardWrapperProps = {
  item: Brand;
  index: number;
};

function BrandCardWrapper({item}: BrandCardWrapperProps) {
  return (
    <div className="w-full h-[150px] flex-center sm-max:border p-2 rounded-lg overflow-hidden hover:shadow-hover ">
      <Link to={`/brands/${item.alt}`}>
        <Image
          src={item.src}
          alt={item.alt}
          className="w-full h-full rounded "
        />
      </Link>
    </div>
  );
}

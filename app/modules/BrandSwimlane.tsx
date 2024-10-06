import {Image} from '@shopify/hydrogen';

import {Section} from '~/components/Text';
import {useTranslation} from '~/lib/utils';
import {Link} from '~/components/Link';

import {Gallery} from './Gallery';

type Brand = {src: string; alt: string};

const mockBrands = {
  nodes: [
    {
      id: 1,
      src: 'https://cdn.shopify.com/s/files/1/0868/0462/7772/files/hynix-1-min-300x200.png?v=1728208124',
      alt: 'Hynix',
    },
    {
      id: 2,
      src: 'https://cdn.shopify.com/s/files/1/0868/0462/7772/files/samsung.webp?v=1728209700',
      alt: 'Samsung',
    },
    {
      id: 3,
      src: 'https://cdn.shopify.com/s/files/1/0868/0462/7772/files/crucial.webp?v=1728209700',
      alt: 'Crucial',
    },
    {
      id: 4,
      src: 'https://cdn.shopify.com/s/files/1/0868/0462/7772/files/vinga.webp?v=1728209700',
      alt: 'Vinga',
    },
    {
      id: 5,
      src: 'https://cdn.shopify.com/s/files/1/0868/0462/7772/files/micron.webp?v=1728209701',
      alt: 'Micron',
    },
    {
      id: 6,
      src: 'https://cdn.shopify.com/s/files/1/0868/0462/7772/files/ugreen.webp?v=1728209701',
      alt: 'Ugreen',
    },
    {
      id: 7,
      src: 'https://cdn.shopify.com/s/files/1/0868/0462/7772/files/kingston.webp?v=1728209700',
      alt: 'Kingston',
    },
  ],
};

type BrandSwimlaneProps = {
  title?: string;
  brands?: {nodes: Brand[]};
};

export function BrandSwimlane({
  title = 'featured_brands',
  brands = mockBrands,
  ...props
}: BrandSwimlaneProps) {
  const {t} = useTranslation();
  const translatedTitle = t(title);

  return (
    <Section
      heading={translatedTitle}
      {...props}
      padding="y"
      display="flex"
      className="flex flex-col"
    >
      <Gallery
        galleryItems={brands.nodes}
        GalleryItemComponent={BrandCardWrapper}
        itemClasses="pl-4 basis-1/2 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
      />
    </Section>
  );
}

export type BrandCardWrapperProps = {
  itemData: Brand;
  index: number;
};

function BrandCardWrapper({itemData}: BrandCardWrapperProps) {
  return (
    <div className="w-full flex-center hover:shadow-hover ">
      <Link to={`/search?q=vendor:${itemData.alt}`}>
        <Image
          src={itemData.src}
          alt={itemData.alt}
          width={200}
          height={130}
          className="w-full  h-auto object-contain"
        />
      </Link>
    </div>
  );
}

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
      src: 'https://cdn.shopify.com/s/files/1/0868/0462/7772/files/Hynix-Logo.svg?v=1731143789',
      alt: 'Hynix',
    },
    {
      id: 2,
      src: 'https://cdn.shopify.com/s/files/1/0868/0462/7772/files/Samsung-logo-vector.webp?v=1731143980',
      alt: 'Samsung',
    },
    {
      id: 3,
      src: 'https://cdn.shopify.com/s/files/1/0868/0462/7772/files/crucial8485.webp?v=1731144591',
      alt: 'Crucial',
    },
    {
      id: 4,
      src: 'https://cdn.shopify.com/s/files/1/0868/0462/7772/files/img_0.webp?v=1731144435',
      alt: 'Vinga',
    },
    {
      id: 5,
      src: 'https://cdn.shopify.com/s/files/1/0868/0462/7772/files/micron_logo_blue_rgb.622dfb9daecbc.webp?v=1731144795',
      alt: 'Micron',
    },
    {
      id: 6,
      src: 'https://cdn.shopify.com/s/files/1/0868/0462/7772/files/ezgif-1-554708c533.webp?v=1731144983',
      alt: 'Ugreen',
    },
    {
      id: 7,
      src: 'https://cdn.shopify.com/s/files/1/0868/0462/7772/files/08e1ba090707d41b55861d4b9129eafa_1.webp?v=1731144866',
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
      className="flex flex-col bg-gray-50"
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
    <div className="w-full flex-center sm-max:border rounded p-4 hover:shadow-hover ">
      <Link to={`/brands/${itemData.alt}`}>
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

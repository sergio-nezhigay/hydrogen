import type {
  HomepageFeaturedProductsQuery,
  ProductCardFragment,
} from 'storefrontapi.generated';
import {Section} from '~/components/Text';
import {ProductCard} from '~/components/ProductCard';
import {Gallery} from '~/modules/Gallery';
import {useTranslation} from '~/lib/utils';
import DynamicGallery from '~/modules/DynamicGallery';

const mockProducts = {
  nodes: new Array(12).fill(''),
};

type ProductSwimlaneProps = HomepageFeaturedProductsQuery & {
  title?: string;
  count?: number;
};

export function ProductSwimlane({
  title = 'featured_products',
  products = mockProducts,
  count = 12,
  ...props
}: ProductSwimlaneProps) {
  const {t} = useTranslation();
  const translatedTitle = t(title);
  console.log('====================================');
  console.log(products.nodes);
  console.log('====================================');
  return (
    <Section
      heading={translatedTitle}
      {...props}
      padding="y"
      display="flex"
      className="flex flex-col "
    >
      {/*<Gallery
        galleryItems={products.nodes}
        GalleryItemComponent={ProductCardWrapper}
        itemClasses="pl-4 basis-1/2 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
      />*/}

      <DynamicGallery
        data={products.nodes}
        presentationComponent={ProductCardWrapper}
        itemStyle="pl-4 basis-1/2 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
      />
    </Section>
  );
}

export type ProductCardWrapperProps = {
  index: number;
  item: ProductCardFragment;
};

function ProductCardWrapper({item}: ProductCardWrapperProps) {
  return <ProductCard product={item} className="w-full" />;
}

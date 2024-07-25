import type {HomepageFeaturedProductsQuery} from 'storefrontapi.generated';
import {Section} from '~/components/Text';
import {ProductCard} from '~/components/ProductCard';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from './ui/carousel';

const mockProducts = {
  nodes: new Array(12).fill(''),
};

type ProductSwimlaneProps = HomepageFeaturedProductsQuery & {
  title?: string;
  count?: number;
};

export function ProductSwimlane({
  title = 'Featured Products',
  products = mockProducts,
  count = 12,
  ...props
}: ProductSwimlaneProps) {
  return (
    <Section heading={title} padding="y" {...props}>
      <Carousel className="w-full ">
        <CarouselContent className="-ml-1">
          {products.nodes.map((product) => (
            <CarouselItem
              key={product.id}
              className=" pl-1 md:basis-1/2 lg:basis-1/5"
            >
              <ProductCard product={product} className="w-full" />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </Section>
  );
}

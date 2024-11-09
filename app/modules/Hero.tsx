import {Image} from '@shopify/hydrogen';

import {useTranslation} from '~/lib/utils';
import {Link} from '~/components/Link';
import {Section} from '~/components/Text';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '~/components/ui/carousel';
import type {Product} from '~/data/heroProducts';
import {heroProducts} from '~/data/heroProducts';

export function HeroSection() {
  return (
    <Section
      useH1
      display="flex"
      heading="Головна сторінка"
      headingClassName="sr-only"
      className="pb-8"
      padding="y"
    >
      <h1 className="sr-only">Головна сторінка</h1>
      <Carousel
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {heroProducts.map((product) => (
            <>
              <CarouselItem>
                <ProductSlide product={product} />
              </CarouselItem>
            </>
          ))}
        </CarouselContent>
        <CarouselPrevious className="sm-max:hidden" />
        <CarouselNext className="sm-max:hidden " />
      </Carousel>
    </Section>
  );
}

const ProductSlide: React.FC<{product: Product}> = ({product}) => {
  const {t} = useTranslation();
  return (
    <div
      className={`flex flex-row relative rounded-lg shadow-lg text-blueAccent overflow-hidden md:h-[320px] transition-opacity duration-700 ease-in-out outline-1`}
    >
      {/* Part 1: Product Description */}

      <ul className="md:uppercase flex flex-col justify-center w-1/3 sm-max:flex-wrap gap-4 text-sm md:text-base lg:text-2xl xl:text-4xl italic md:font-bold md:space-y-1 sm-max:gap-x-4 sm-max:mb-4 items-start">
        {product.advantages.map((advantage: string) => (
          <li key={advantage}>
            <div>{t(advantage)}</div>
          </li>
        ))}
      </ul>

      {/* Part 2: Product Image */}
      <div className="sm-max:h-[200px] sm-max:-translate-x-8 w-[42%] flex items-center justify-center">
        <Image
          src={product.imageUrl}
          alt={product.name}
          className="object-contain w-full h-full"
          sizes="40vw"
        />
      </div>

      {/* Part 3: Price Section */}
      <div className="absolute right-0 top-0 justify-between h-full items-end flex flex-col font-medium py-4">
        <p className=" text-sm sm-max:text-center sm:text-[20px] lg:text-[25px] xl:text-[34px] 2xl:text-[38px] mb-3 md:mb-8">
          {t(product.name)}
        </p>
        <div className="flex flex-col items-center gap-3">
          <div className="flex flex-col gap-1 sm-max:mb-4">
            {product.oldPrice && (
              <div className="w-fit md:text-xl opacity-85 text-center mx-auto line-through">
                {product.oldPrice}
              </div>
            )}
            <div className="relative w-fit md:inline-block md:mb-4 lg:mb-10">
              <div className="absolute inset-0 transform -rotate-6 bg-red-400 rounded p-1 lg:p-3"></div>

              <div className="relative z-10 md:text-2xl xl:text-3xl bg-transparent font-medium p-1 lg:p-3">
                {product.currentPrice}
              </div>
            </div>
          </div>

          <Link
            to={`/products/${product.productPageUrl}`}
            className="w-fit sm-max:mx-auto font-bold flex px-2 py-1 md:px-6 md:py-3 bg-blueAccent text-white rounded-lg hover:opacity-85 transition-all"
          >
            {t('View Details')}
          </Link>
        </div>
      </div>
    </div>
  );
};

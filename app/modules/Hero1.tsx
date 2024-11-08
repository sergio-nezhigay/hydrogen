import {useState, useEffect} from 'react';
import {Image} from '@shopify/hydrogen';

import {cn, useTranslation} from '~/lib/utils';
import {Link} from '~/components/Link';
import {Section} from '~/components/Text';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '~/components/ui/carousel';

export function HeroSection1() {
  const [isVisible, setIsVisible] = useState(false);
  const {translation} = useTranslation();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const buttonStyle =
    'font-bold inline-block px-6 py-3 mt-4 bg-white/90 text-indigo-900 rounded-lg hover:bg-indigo-700 hover:text-white transition-color';

  return (
    <Section>
      <Carousel className="w-full ">
        <CarouselContent>
          <CarouselItem>
            <ProductSlide product={sampleProduct} />
          </CarouselItem>
          <CarouselItem>
            <ProductSlide product={sampleProduct} />
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious className="sm-max:hidden text-blueAccent hover:text-blueAccent" />
        <CarouselNext className="sm-max:hidden text-blueAccent hover:text-blueAccent" />
      </Carousel>
    </Section>
  );
}

const ProductSlide = ({product}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Trigger visibility animation when component is mounted
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`flex flex-col md:flex-row  rounded-lg shadow-lg text-blueAccent overflow-hidden md:h-[320px] transition-opacity duration-700 ease-in-out outline-1 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Part 1: Product Description */}

      <ul className="p-0 md:p-2 lg:p-6 xl:p-12 pr-0 md:w-1/3 sm-max:flex-wrap  sm-max:text-center text-sm md:text-base lg:text-2xl xl:text-4xl italic md:font-bold md:space-y-1 sm-max:flex-center sm-max:gap-x-4 sm-max:mb-4">
        {product.advantages.map((advantage, index) => (
          <li key={index}>
            <div>{advantage}</div>
          </li>
        ))}
      </ul>

      {/* Part 2: Product Image */}
      <div className="w-full sm-max:h-[200px] border-blue-500 md:w-1/3 flex shrink items-center justify-center md:p-4">
        <Image
          src={product.imageUrl}
          alt={product.name}
          className="object-contain w-full h-full"
          sizes="(max-width: 768px) 100vw, 30vw"
        />
      </div>

      {/* Part 3: Price Section */}
      <div className="md:w-1/3 p-1 md:p-8 xl:p-16 md:flex-col justify-center md:items-end  font-medium inline-block sm-max:gap-4">
        <div className="">
          <p className="text-base sm-max:text-center lg:text-[25px] xl:text-[37px] mb-3">
            {product.name}
          </p>
          <div className=" md:mr-6 lg:mr-20 sm-max:flex-center sm-max:gap-2 sm-max:mb-4">
            {product.oldPrice && (
              <div className="w-fit md:text-xl opacity-85 text-center align-middle line-through mb-2">
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
        </div>

        <Link
          to={`/products/${product.productPageUrl}`}
          className="w-fit mx-auto font-bold flex px-6 py-3 bg-blueAccent text-white rounded-lg hover:opacity-85 transition-all"
        >
          View Product
        </Link>
      </div>
    </div>
  );
};

// Usage example:
const sampleProduct = {
  name: 'Headphones JBL T110',
  description: 'Experience the best quality and unmatched performance.',
  imageUrl:
    'https://cdn.shopify.com/s/files/1/0868/0462/7772/files/941476115_w640_h640_cid2386358_pid599412811-b0a93887-800x800-1.jpg?',
  currentPrice: '299грн',
  oldPrice: '450грн',
  productPageUrl:
    'naushniki-jbl-t110-black-jblt110blk?q=t110&_pos=1&_psq=t110&_ss=e&_v=1.0',
  advantages: [
    'Clear bass',
    'Button control',
    'Flat cable',
    'Microphone included',
  ],
};

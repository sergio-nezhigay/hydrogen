import {useState, useEffect, useCallback, FC} from 'react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '~/components/ui/carousel';

import {Thumb} from './Thumb';

import {DotButtons} from './DotButtons';
import {ProductCardWrapperProps} from '~/components/ProductSwimlane';
import {ProductImageProps} from '~/routes/($locale).products.$productHandle';

type GalleryProps = {
  galleryItems: any[];
  GalleryItemComponent: FC<ProductCardWrapperProps> | FC<ProductImageProps>;
  itemClasses?: string;
  showThumbs?: boolean;
};

export function Gallery({
  GalleryItemComponent,
  galleryItems,
  itemClasses,
  showThumbs = false,
}: GalleryProps) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [thumbsCarouselApi, setThumbsCarouselApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!carouselApi || !thumbsCarouselApi) return;
    setCurrentIndex(carouselApi.selectedScrollSnap() + 1);
    const handleSelect = () =>
      setCurrentIndex(carouselApi.selectedScrollSnap() + 1);
    carouselApi.on('select', handleSelect);
    return () => {
      carouselApi.off('select', handleSelect);
    };
  }, [carouselApi, thumbsCarouselApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (!carouselApi) return;
      carouselApi.scrollTo(index);
      setCurrentIndex(carouselApi.selectedScrollSnap());
    },
    [carouselApi],
  );

  const onSelect = useCallback(() => {
    if (!carouselApi) return;
    setCurrentIndex(carouselApi.selectedScrollSnap());
    if (thumbsCarouselApi)
      thumbsCarouselApi.scrollTo(carouselApi.selectedScrollSnap());
  }, [carouselApi, thumbsCarouselApi]);

  useEffect(() => {
    if (!carouselApi) return;
    onSelect();

    carouselApi.on('select', onSelect).on('reInit', onSelect);

    return () => {
      carouselApi.off('select', onSelect).off('reInit', onSelect);
    };
  }, [carouselApi, onSelect]);

  if (!galleryItems.length) {
    return null;
  }

  return (
    <div className="w-full md:px-12 ">
      <Carousel
        setApi={setCarouselApi}
        opts={{
          align: 'start',
        }}
      >
        <CarouselContent>
          {galleryItems.map((item, index) => {
            return (
              <CarouselItem key={item.id} className={itemClasses}>
                <GalleryItemComponent childData={item} index={index} />
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="sm-max:hidden" />
        <CarouselNext className="sm-max:hidden" />
      </Carousel>
      {/*dots*/}
      <DotButtons
        totalButtons={galleryItems.length}
        activeIndex={currentIndex}
        onButtonClick={scrollTo}
      />
      {/*thumbs*/}
      {showThumbs && (
        <Carousel
          setApi={setThumbsCarouselApi}
          opts={{
            containScroll: 'keepSnaps',
            dragFree: true,
          }}
          className="sm-max:hidden mt-4"
        >
          <CarouselContent className="-ml-4">
            {galleryItems.map((item, index) => (
              <CarouselItem key={item.id} className="pl-4 basis-1/10 ">
                <Thumb
                  onClick={() => scrollTo(index)}
                  selected={index === currentIndex}
                  index={index}
                  item={item}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}
    </div>
  );
}

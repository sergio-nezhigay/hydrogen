import React, {useState, useEffect, useCallback} from 'react';
import clsx from 'clsx';
import {Image} from '@shopify/hydrogen';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '~/components/ui/carousel';

import {DotButtons} from './DotButtons';

interface DynamicGalleryProps<T> {
  data: T[];
  presentationComponent: React.ComponentType<{item: T; index: number}>;
  itemStyle: string;
  showThumbs?: boolean;
}

function DynamicGallery<T extends {id: string | number}>({
  data,
  presentationComponent: PresentationComponent,
  itemStyle,
  showThumbs = false,
}: DynamicGalleryProps<T>) {
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

  if (!data.length) {
    return null;
  }

  return (
    <div className="w-full">
      <Carousel
        setApi={setCarouselApi}
        opts={{
          align: 'start',
          loop: true,
        }}
      >
        <CarouselContent>
          {data.map((item, index) => {
            return (
              <CarouselItem key={item.id} className={clsx(itemStyle)}>
                <PresentationComponent item={item} index={index} />
              </CarouselItem>
            );
          })}
        </CarouselContent>
        {data.length > 1 && (
          <>
            <CarouselPrevious className="sm-max:hidden" />
            <CarouselNext className="sm-max:hidden" />
          </>
        )}
      </Carousel>
      {/*dots*/}
      <DotButtons
        onButtonClick={scrollTo}
        totalButtons={data.length}
        activeIndex={currentIndex}
      />

      {/*thumbs*/}
      {showThumbs && data.length > 1 && (
        <>
          <Carousel
            setApi={setThumbsCarouselApi}
            opts={{
              containScroll: 'keepSnaps',
              dragFree: true,
            }}
            className="sm-max:hidden mt-4 mr-1"
          >
            <CarouselContent className="-ml-4">
              {data.map((item, index) => {
                const possibleItem = item as any;
                const image =
                  possibleItem.__typename === 'MediaImage'
                    ? {...(item as any).image, altText: possibleItem.alt}
                    : null;
                return (
                  <CarouselItem key={item.id} className="pl-4 basis-1/10">
                    {image && (
                      <button
                        onClick={() => scrollTo(index)}
                        onMouseEnter={() => scrollTo(index)}
                        type="button"
                        className={`flex items-center justify-center w-full bg-primary/5 aspect-square`}
                      >
                        <Image
                          src={image.url}
                          alt={image.altText}
                          width={70}
                          height={70}
                          sizes="70px"
                          className="w-full h-full"
                        />
                      </button>
                    )}
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        </>
      )}
    </div>
  );
}

export default DynamicGallery;

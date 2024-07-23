import {Image} from '@shopify/hydrogen';
import {useState, useEffect, useCallback} from 'react';
import type {EmblaOptionsType} from 'embla-carousel';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '~/components/ui/carousel';
import type {MediaFragment} from 'storefrontapi.generated';

import {Thumb} from './Thumb';

type PropType = {
  slides: number[];
  options?: EmblaOptionsType;
  media: MediaFragment[];
};

const EmblaCarousel: React.FC<PropType> = ({slides, options, media}) => {
  const [api, setApi] = useState<CarouselApi>();
  const [thumbsApi, setThumbsApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const onThumbClick = useCallback(
    (index: number) => {
      if (!api || !thumbsApi) return;
      api.scrollTo(index);
    },
    [api, thumbsApi],
  );

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap() + 1);
    const handleSelect = () => setCurrent(api.selectedScrollSnap() + 1);
    api.on('select', handleSelect);
    return () => {
      api.off('select', handleSelect);
    };
  }, [api]);

  const onSelect = useCallback(() => {
    if (!thumbsApi || !api) return;
    setCurrent(api.selectedScrollSnap());
    thumbsApi.scrollTo(api.selectedScrollSnap());
  }, [api, thumbsApi]);

  useEffect(() => {
    if (!api) return;
    onSelect();

    api.on('select', onSelect).on('reInit', onSelect);
    return () => {
      api.off('select', onSelect).off('reInit', onSelect);
    };
  }, [api, onSelect]);

  return (
    <div className="w-full">
      {/*<div className=" w-full lg:col-span-2">*/}
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {media.map((med, index) => {
            const image =
              med.__typename === 'MediaImage'
                ? {...med.image, altText: med.alt || 'Product image'}
                : null;

            return (
              <CarouselItem key={med.id}>
                <>
                  {image && (
                    <Image
                      loading={index === 0 ? 'eager' : 'lazy'}
                      data={image}
                      sizes="(min-width: 48em) 60vw, 90vw"
                      className="object-cover w-full h-full aspect-square fadeIn"
                    />
                  )}
                </>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <Carousel
        setApi={setThumbsApi}
        opts={{
          containScroll: 'keepSnaps',
          dragFree: true,
        }}
      >
        <CarouselContent className="-ml-1 items-center">
          {media.map((med, index) => (
            <CarouselItem key={med.id} className="pl-1 basis-1/10">
              <Thumb
                onClick={() => onThumbClick(index)}
                selected={index === current}
                index={index}
                med={med}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default EmblaCarousel;

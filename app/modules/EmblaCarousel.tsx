import {Image} from '@shopify/hydrogen';

import React, { useState, useEffect, useCallback } from 'react';
import { EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { Thumb } from './Thumb';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '~/components/ui/carousel';
import type {MediaFragment} from 'storefrontapi.generated';

type PropType = {
  slides: number[];
  options?: EmblaOptionsType;
  media: MediaFragment[];
};

const EmblaCarousel: React.FC<PropType> = ({ slides, options, media }) => {
  const [api, setApi] = useState<CarouselApi>();
  const [thumbsApi, setThumbsApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const onThumbClick = useCallback(
    (index: number) => {
      if (!api || !thumbsApi) return;
      api.scrollTo(index);
    },
    [api, thumbsApi]
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
    <div className=" w-full lg:col-span-2">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {media.map((med, i) => {
                   const image =
                   med.__typename === 'MediaImage'
                     ? {...med.image, altText: med.alt || 'Product image'}
                     : null;

            return  <CarouselItem key={i}>
              <>{image && (
              <Image
                loading={i === 0 ? 'eager' : 'lazy'}
                data={image}
                sizes="200px"  
       
                className="object-cover w-full h-full aspect-square fadeIn"
              />
            )}</>
              
            </CarouselItem>
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

        <Carousel
          setApi={setThumbsApi}
          className="w-full max-w-sm mt-2"
          opts={{
            containScroll: 'keepSnaps',
            dragFree: true,
          }}
        >
          <CarouselContent className="-ml-1 items-center">
            {media.map((med, index) => (
              <CarouselItem key={index} className='pl-1 basis-1/5'>
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

import React, { useState, useEffect, useCallback } from 'react';
import { EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { Thumb } from './Thumb';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '~/components/ui/carousel';

type PropType = {
  slides: number[];
  options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<PropType> = ({ slides, options }) => {
  const [api, setApi] = useState<CarouselApi>();
  const [thumbsApi, setThumbsApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const onThumbClick = useCallback(
    (index: number) => {
      if (!api || !thumbsApi) return;
      api.scrollTo(index);
    },
    [api, thumbsApi]
  );

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
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
    <div className="max-w-2xl mx-auto h-20">
      <Carousel setApi={setApi} className="w-full max-w-xs">
        <CarouselContent>
          {slides.map((index) => (
            <CarouselItem key={index}>
              <h1>CarouselItem</h1>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="py-2 text-center text-sm text-muted-foreground">
        Slide {current} of {count}
      </div>
        <Carousel
          setApi={setThumbsApi}
          className="w-full max-w-sm mt-2"
          opts={{
            containScroll: 'keepSnaps',
            dragFree: true,
          }}
        >
          <CarouselContent className="-ml-1">
            {slides.map((index) => (
              <CarouselItem key={index} className='pl-1 basis-1/5'>
                <Thumb
                  onClick={() => onThumbClick(index)}
                  selected={index === current}
                  index={index}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

    </div>
  );
};

export default EmblaCarousel;

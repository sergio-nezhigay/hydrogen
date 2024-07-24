import {Image} from '@shopify/hydrogen';
import {useState, useEffect, useCallback} from 'react';

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

type ProductImagesProps = {
  media: MediaFragment[];
};

function ProductImages({media}: ProductImagesProps) {
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
    if (!api || !thumbsApi) return;
    setCurrent(api.selectedScrollSnap() + 1);
    const handleSelect = () => setCurrent(api.selectedScrollSnap() + 1);
    api.on('select', handleSelect);
    return () => {
      api.off('select', handleSelect);
    };
  }, [api, thumbsApi]);

  const onSelect = useCallback(() => {
    if (!api || !thumbsApi) return;
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

  if (!media.length) {
    return null;
  }

  return (
    <div className="w-full md:px-12 ">
      <Carousel setApi={setApi}>
        <CarouselContent>
          {media.map((med, index) => {
            const image =
              med.__typename === 'MediaImage'
                ? {...med.image, altText: med.alt || 'Product image ' + index}
                : null;

            return (
              <CarouselItem key={med.id}>
                <>
                  {image && (
                    <Image
                      loading={index === 0 ? 'eager' : 'lazy'}
                      data={image}
                      aspectRatio={'1/1'}
                      sizes="auto"
                      className="object-cover w-full h-full fadeIn"
                    />
                  )}
                </>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="sm-max:hidden" />
        <CarouselNext className="sm-max:hidden" />
      </Carousel>

      <Carousel
        setApi={setThumbsApi}
        opts={{
          containScroll: 'keepSnaps',
          dragFree: true,
        }}
        className="sm-max:hidden mt-4"
      >
        <CarouselContent className="-ml-4">
          {media.map((med, index) => (
            <CarouselItem key={med.id} className="pl-4 basis-1/10 ">
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
}

export default ProductImages;

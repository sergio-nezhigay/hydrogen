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
  nodesArray: any[];
  ChildComponent: FC<ProductCardWrapperProps> | FC<ProductImageProps>;
  itemClasses?: string;
  showThumbs?: boolean;
};

export function Gallery({
  ChildComponent,
  nodesArray,
  itemClasses,
  showThumbs = false,
}: GalleryProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [thumbsApi, setThumbsApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api || !thumbsApi) return;
    setCurrent(api.selectedScrollSnap() + 1);
    const handleSelect = () => setCurrent(api.selectedScrollSnap() + 1);
    api.on('select', handleSelect);
    return () => {
      api.off('select', handleSelect);
    };
  }, [api, thumbsApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (!api) return;
      api.scrollTo(index);
      setCurrent(api.selectedScrollSnap());
    },
    [api],
  );

  const onSelect = useCallback(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    if (thumbsApi) thumbsApi.scrollTo(api.selectedScrollSnap());
  }, [api, thumbsApi]);

  useEffect(() => {
    if (!api) return;
    onSelect();

    api.on('select', onSelect).on('reInit', onSelect);

    return () => {
      api.off('select', onSelect).off('reInit', onSelect);
    };
  }, [api, onSelect]);

  if (!nodesArray.length) {
    return null;
  }

  return (
    <div className="w-full md:px-12 ">
      <Carousel setApi={setApi}>
        <CarouselContent>
          {nodesArray.map((med, index) => {
            return (
              <CarouselItem key={med.id} className={itemClasses}>
                <ChildComponent childData={med} index={index} />
              </CarouselItem>
            );
          })}
        </CarouselContent>
        {/*<CarouselPrevious className="sm-max:hidden" />
        <CarouselNext className="sm-max:hidden" />*/}
      </Carousel>
      <DotButtons
        totalButtons={nodesArray.length}
        activeIndex={current}
        onButtonClick={scrollTo}
      />
      {/*thumbs*/}
      {showThumbs && (
        <Carousel
          setApi={setThumbsApi}
          opts={{
            containScroll: 'keepSnaps',
            dragFree: true,
          }}
          className="sm-max:hidden mt-4"
        >
          <CarouselContent className="-ml-4">
            {nodesArray.map((med, index) => (
              <CarouselItem key={med.id} className="pl-4 basis-1/10 ">
                <Thumb
                  onClick={() => scrollTo(index)}
                  selected={index === current}
                  index={index}
                  med={med}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}
    </div>
  );
}

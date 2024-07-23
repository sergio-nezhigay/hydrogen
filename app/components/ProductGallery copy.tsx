import {Image} from '@shopify/hydrogen';
import { EmblaOptionsType } from 'embla-carousel';


import type {MediaFragment} from 'storefrontapi.generated';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import EmblaCarousel from '~/modules/EmblaCarousel';
const OPTIONS: EmblaOptionsType = {};
// const SLIDE_COUNT = 10;
// const SLIDES = Array.from(Array(SLIDE_COUNT).keys());
/**
 * A client component that defines a media gallery for hosting images, 3D models, and videos of products
 */
export function ProductGallery({
  media,
  className,
}: {
  media: MediaFragment[];
  className?: string;
}) {
  if (!media.length) {
    return null;
  }
  const SLIDES = Array.from(Array(media.length).keys());

  return (

      <EmblaCarousel slides={SLIDES} options={OPTIONS} media={media}/>

  );
}

import {Image} from '@shopify/hydrogen';
import {useState, useRef, useEffect} from 'react';

import type {MediaFragment} from 'storefrontapi.generated';

export type ProductImageProps = {
  item: MediaFragment;
  index: number;
};

export function ProductImage({item, index}: ProductImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const image =
    item.__typename === 'MediaImage'
      ? {...item.image, altText: item.alt || `Product image ${index}`}
      : null;

  const lqipUrl = image?.url
    ? `${image.url}?width=20&height=20&quality=10`
    : '';
  const fullUrl = image?.url || '';

  useEffect(() => {
    const imgElement = imgRef.current;
    if (imgElement && fullUrl) {
      imgElement.onload = () => setIsLoaded(true);
    }
  }, [fullUrl]);

  if (!image) return null;

  return (
    <div className="w-full h-auto flex-center aspect-square relative">
      {/* LQIP Placeholder */}
      <img
        src={lqipUrl}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          filter: 'blur(10px)',
          transition: 'opacity 0.5s ease',
          opacity: isLoaded ? 0 : 1,
        }}
      />

      {/* Full-quality Image */}
      <Image
        ref={imgRef}
        loading={index === 0 ? 'eager' : 'lazy'}
        src={fullUrl}
        alt={image.altText}
        sizes="(min-width: 768px) 50vw, 100vw"
        className="w-full relative"
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}
      />
    </div>
  );
}

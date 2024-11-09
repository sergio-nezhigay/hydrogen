import {Image} from '@shopify/hydrogen';

import type {MediaFragment} from 'storefrontapi.generated';

export type ProductImageProps = {
  itemData: MediaFragment;
  index: number;
};

export function ProductImage({itemData, index}: ProductImageProps) {
  const image =
    itemData.__typename === 'MediaImage'
      ? {...itemData.image, altText: itemData.alt || 'Product image ' + index}
      : null;
  return (
    <div className="w-full h-[auto] aspect-square flex-center">
      {image && (
        <Image
          loading={index === 0 ? 'eager' : 'lazy'}
          src={image.url}
          alt={image.altText}
          sizes="(min-width: 768px) 50vw, 100vw"
          className="w-full h-auto"
        />
      )}
    </div>
  );
}

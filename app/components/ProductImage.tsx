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
    <div className="card-image object-contain aspect-square flex">
      {image && (
        <Image
          loading={index === 0 ? 'eager' : 'lazy'}
          data={image}
          sizes="(min-width: 768px) 40vw, 90vw"
          className="object-contain w-full h-auto"
          aspectRatio="1/1"
        />
      )}
    </div>
  );
}

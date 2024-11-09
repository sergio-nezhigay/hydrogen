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
    <div className="object-contain aspect-square flex">
      {image && (
        <Image
          loading={index === 0 ? 'eager' : 'lazy'}
          width={0}
          data={image}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain w-full h-auto"
        />
      )}
    </div>
  );
}

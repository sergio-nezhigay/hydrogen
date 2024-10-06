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
    <div className="bg-primary/5">
      {image && (
        <Image
          loading={index === 0 ? 'eager' : 'lazy'}
          data={image}
          aspectRatio={'1/1'}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover w-full h-full"
        />
      )}
    </div>
  );
}

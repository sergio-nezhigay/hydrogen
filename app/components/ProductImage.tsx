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
    <div className="w-full h-[auto] relative object-cover">
      {image && (
        <Image
          loading={index === 0 ? 'eager' : 'lazy'}
          data={image}
          sizes="(min-width: 768px) 50vw, 100vw"
          aspectRatio="1/1"
          className="w-full h-full"
        />
      )}
    </div>
  );
}

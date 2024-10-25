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
    <>
      {image && (
        <div className="flex aspect-square">
          <Image
            loading={index === 0 ? 'eager' : 'lazy'}
            data={image}
            sizes="(min-width: 45em) 50vw, 100vw"
            className="object-contain"
          />
        </div>
      )}
    </>
  );
}

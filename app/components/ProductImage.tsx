import {Image} from '@shopify/hydrogen';

import type {MediaFragment} from 'storefrontapi.generated';

export type ProductImageProps = {
  item: MediaFragment;
  index: number;
};

export function ProductImage({item, index}: ProductImageProps) {
  const image =
    item.__typename === 'MediaImage'
      ? {...item.image, altText: item.alt || 'Product image ' + index}
      : null;
  return (
    <div className="w-full h-auto flex-center aspect-square">
      {image && (
        <Image
          loading={index === 0 ? 'eager' : 'lazy'}
          src={image.url}
          alt={image.altText}
          sizes="(min-width: 768px) 50vw, 100vw"
          className="w-full"
        />
      )}
    </div>
  );
}

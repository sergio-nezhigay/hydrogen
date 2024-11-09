import {Image} from '@shopify/hydrogen';
import clsx from 'clsx';

import type {MediaFragment} from 'storefrontapi.generated';
type PropType = {
  selected: boolean;
  index: number;
  item: MediaFragment;
  onClick: () => void;
};

export function Thumb({selected, onClick, item}: PropType) {
  const image =
    item.__typename === 'MediaImage'
      ? {...item.image, altText: item.alt || 'Product image'}
      : null;

  return (
    <div
      className={clsx('border ', {
        'border-primary': selected,
        'border-transparent': !selected,
      })}
    >
      <button
        onClick={onClick}
        onMouseEnter={onClick}
        type="button"
        className={`flex items-center justify-center w-full bg-primary/5 aspect-square`}
      >
        {image && (
          <Image
            src={image.url}
            alt={image.altText}
            width={70}
            height={70}
            //aspectRatio={'1/1'}
            sizes="70px"
            className="w-full h-full"
          />
        )}
      </button>
    </div>
  );
}

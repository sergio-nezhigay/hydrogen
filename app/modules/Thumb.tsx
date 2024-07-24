import {Image} from '@shopify/hydrogen';
import clsx from 'clsx';

import type {MediaFragment} from 'storefrontapi.generated';
type PropType = {
  selected: boolean;
  index: number;
  med: MediaFragment;
  onClick: () => void;
};

export function Thumb({selected, onClick, med}: PropType) {
  const image =
    med.__typename === 'MediaImage'
      ? {...med.image, altText: med.alt || 'Product image'}
      : null;

  return (
    <div
      className={clsx('border', {
        'border-primary': selected,
        'border-transparent': !selected,
      })}
    >
      <button
        onClick={onClick}
        type="button"
        className={`inline-flex items-center justify-center w-full focus:outline-none`}
      >
        {image && (
          <Image
            data={image}
            width={100}
            height={100}
            aspectRatio={'1/1'}
            sizes="auto"
            className="object-cover w-full h-full fadeIn"
          />
        )}
      </button>
    </div>
  );
}

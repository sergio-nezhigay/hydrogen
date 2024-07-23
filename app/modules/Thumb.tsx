import React from 'react';
import type {MediaFragment} from 'storefrontapi.generated';
import {Image} from '@shopify/hydrogen';
type PropType = {
  selected: boolean;
  index: number;
  med: MediaFragment;
  onClick: () => void;
};

export const Thumb: React.FC<PropType> = ({ selected, index, onClick, med }) => {
  const image =
  med.__typename === 'MediaImage'
    ? {...med.image, altText: med.alt || 'Product image'}
    : null;

  return (
    <div className={`${selected ? 'bg-stone-300' : 'bg-stone-50'} p-1`}>
      <button
        onClick={onClick}
        type="button"
        className={`inline-flex items-center justify-center w-full focus:outline-none`}
      >
        {/* {index + 1} */}
        {image&&        <Image

                data={image}
                sizes="200px"  
       
                className="object-cover w-full h-full aspect-square fadeIn"
              />}

      </button>
    </div>
  );
};
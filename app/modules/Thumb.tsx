import React from 'react';

type PropType = {
  selected: boolean;
  index: number;
  onClick: () => void;
};

export const Thumb: React.FC<PropType> = ({ selected, index, onClick }) => {
  return (
    <div className={`flex-shrink-0 w-20 h-20 ${selected ? 'bg-gray-800 text-white' : 'bg-transparent'} min-w-0  pl-2`}>
      <button
        onClick={onClick}
        type="button"
        className={`inline-flex items-center justify-center w-full h-16 text-xl font-semibold shadow-inner rounded-full focus:outline-none ${selected ? 'text-white' : 'text-gray-800'}`}
      >
        {index + 1}
      </button>
    </div>
  );
};
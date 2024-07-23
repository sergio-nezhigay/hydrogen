import React from 'react';

type PropType = {
  selected: boolean;
  index: number;
  onClick: () => void;
};

export const Thumb: React.FC<PropType> = ({ selected, index, onClick }) => {
  return (
    <div className={`${selected ? 'bg-blue-400' : 'bg-red-500'} p-1`}>
      <button
        onClick={onClick}
        type="button"
        className={`inline-flex items-center justify-center w-full focus:outline-none`}
      >
        {index + 1}
      </button>
    </div>
  );
};
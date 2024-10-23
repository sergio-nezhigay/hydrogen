import clsx from 'clsx';

import {Button} from '~/components/Button';

type DotButtonsProps = {
  totalButtons: number;
  activeIndex: number;
  onButtonClick: (index: number) => void;
};

export function DotButtons({
  totalButtons,
  activeIndex,
  onButtonClick,
}: DotButtonsProps) {
  return (
    <>
      {totalButtons > 1 && (
        <div className="flex-center md:hidden gap-2 my-4">
          {Array.from({length: totalButtons}).map((_, index) => (
            <DotButton
              key={index}
              isSelected={index === activeIndex}
              onClick={() => onButtonClick(index)}
            />
          ))}
        </div>
      )}
    </>
  );
}

type DotButtonProps = {
  isSelected: boolean;
  onClick: () => void;
};

function DotButton({isSelected, onClick}: DotButtonProps) {
  return (
    <Button
      className={clsx('inline-block p-2 h-0 rounded-full', {
        'bg-stone-900': isSelected,
        '!bg-stone-200': !isSelected,
      })}
      type="button"
      onClick={onClick}
      aria-pressed={isSelected}
      aria-label={isSelected ? 'Поточне зображення' : 'Вибрати зображення'}
    />
  );
}

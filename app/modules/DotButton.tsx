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
    <div className="flex-center sm:hidden gap-2 mt-4">
      {Array.from({length: totalButtons}).map((_, index) => (
        <DotButton
          key={index}
          isSelected={index === activeIndex}
          onClick={() => onButtonClick(index)}
        />
      ))}
    </div>
  );
}

type DotButtonProps = {
  isSelected: boolean;
  onClick: () => void;
};

function DotButton({isSelected, onClick}: DotButtonProps) {
  return (
    <Button
      className={clsx(
        'inline-block p-2 h-0 rounded-full',
        isSelected ? 'bg-stone-800' : 'bg-stone-300',
      )}
      type="button"
      onClick={onClick}
    />
  );
}

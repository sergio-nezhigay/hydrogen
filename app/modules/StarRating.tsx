import {Star, StarHalf} from 'lucide-react';

const FILL_COLOR = '#fbbf24';
const EMPTY_COLOR = '#e5e7eb';

export const filledStar = <Star fill={FILL_COLOR} strokeWidth={0} />;
export const halfFilledStar = <StarHalf fill={FILL_COLOR} strokeWidth={0} />;
export const star = <Star fill={EMPTY_COLOR} strokeWidth={0} />;

export function StarRating({rating}: {rating: number}) {
  return (
    <>
      <div className="relative">
        <div className="inline-flex gap-0.5">
          {Array.from({length: 5}, (_, index) => (
            <Star fill={EMPTY_COLOR} strokeWidth={0} key={index} />
          ))}
        </div>
        <div className="absolute top-0 left-0 inline-flex gap-0.5">
          {rating >= 1 ? filledStar : rating >= 0.5 ? halfFilledStar : star}
          {rating >= 2 ? filledStar : rating >= 1.5 ? halfFilledStar : star}
          {rating >= 3 ? filledStar : rating >= 2.5 ? halfFilledStar : star}
          {rating >= 4 ? filledStar : rating >= 3.5 ? halfFilledStar : star}
          {rating >= 5 ? filledStar : rating >= 4.5 ? halfFilledStar : star}
        </div>
      </div>
    </>
  );
}

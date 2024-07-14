import {Star} from '~/components/Icon';

export function StarRating({rating}: {rating: number}) {
  const filledStar = <Star fill="full" />;
  const halfFilledStar = <Star fill="half" />;
  const star = <Star fill="empty" />;

  return (
    <div className="inline-flex gap-0.5">
      {rating >= 1 ? filledStar : rating >= 0.5 ? halfFilledStar : star}
      {rating >= 2 ? filledStar : rating >= 1.5 ? halfFilledStar : star}
      {rating >= 3 ? filledStar : rating >= 2.5 ? halfFilledStar : star}
      {rating >= 4 ? filledStar : rating >= 3.5 ? halfFilledStar : star}
      {rating >= 5 ? filledStar : rating >= 4.5 ? halfFilledStar : star}
    </div>
  );
}

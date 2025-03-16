import {Section, Text} from '~/components/Text';
import type {JudgemeReview} from '~/lib/type';
import {formatDateForTimeTag} from '~/lib/utils';

import {StarRating} from './StarRating';

type ReviewCardProps = {
  review: JudgemeReview;
};

function ReviewCard({review}: ReviewCardProps) {
  const {dateTime, displayDate} = formatDateForTimeTag(review.created_at);
  const reviewerName = review.reviewer.name;
  return (
    <>
      <Text as="h3" className="mr-2 font-semibold mb-2 ">
        {reviewerName}
      </Text>

      <Text className="text-sm">
        <time dateTime={dateTime}>{displayDate}</time>
      </Text>
      <div className="mt-2 flex items-center">
        <StarRating rating={review.rating} />
      </div>
      <Text className="mt-1 line-clamp-4">{review.body}</Text>
    </>
  );
}

type ReviewListProps = {
  reviews: JudgemeReview[];
  title: string;
};

function ReviewList({reviews, title}: ReviewListProps) {
  return (
    <>
      {reviews.length > 0 && (
        <Section heading={title} padding="y" id="review-list">
          <ul>
            {reviews
              .filter(({published}) => published)
              .map((review) => (
                <li
                  key={review.id}
                  className="mb-6 rounded-lg border p-4 shadow-md"
                >
                  <ReviewCard review={review} />
                </li>
              ))}
          </ul>
        </Section>
      )}
    </>
  );
}

export {ReviewList, ReviewCard};

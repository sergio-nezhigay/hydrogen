import {Section, Text} from '~/components/Text';
import type {JudgemeReview} from '~/lib/type';
import {formatDateForTimeTag} from '~/lib/utils';

import {StarRating} from './StarRating';

type ReviewCardProps = {
  review: JudgemeReview;
};

function ReviewCard({review}: ReviewCardProps) {
  const {dateTime, displayDate} = formatDateForTimeTag(review.created_at);

  return (
    <>
      {' '}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center">
          <Text as="h3" className="mr-2 font-semibold">
            {review.reviewer.name}
          </Text>
          {review.verified && (
            <span className="flex items-center text-xs text-green-600">
              <svg
                className="mr-1 size-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              Перевірена покупка
            </span>
          )}
        </div>
        <Text className="text-sm">
          <time dateTime={dateTime}>{displayDate}</time>
        </Text>
      </div>
      <div className="mt-2 flex items-center">
        <StarRating rating={review.rating} />
      </div>
      <Text className="mt-1">{review.body}</Text>
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
        <Section heading={title} padding="y">
          <ul>
            {reviews.map((review) => (
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

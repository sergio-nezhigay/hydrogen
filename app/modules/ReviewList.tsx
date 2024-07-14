import {Heading, Section, Text} from '~/components/Text';
import type {JudgemeReview} from '~/lib/type';

import {StarRating} from './StarRating';

type ReviewListProps = {
  reviews: JudgemeReview[];
  title: string;
};

function ReviewList({reviews, title}: ReviewListProps) {
  return (
    <>
      {reviews.length > 0 && (
        <Section className="px-0 md:px-8 lg:px-12">
          <Heading as="h2" className="mb-4">
            {title}
          </Heading>
          {reviews.map((review) => (
            <div key={review.id} className="mb-6 border-b pb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Text as="h3" className="font-semibold mr-2">
                    {review.reviewer.name}
                  </Text>
                  {review.verified && (
                    <span className="text-xs text-green-600">
                      Verified Purchase
                    </span>
                  )}
                </div>
                <Text className="text-sm text-gray-500">
                  {new Date(review.created_at).toLocaleDateString('uk-UA', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </Text>
              </div>
              <Text className="mt-1">{review.body}</Text>
              <div className="mt-2 flex items-center">
                <StarRating rating={review.rating} />
              </div>
            </div>
          ))}
        </Section>
      )}
    </>
  );
}

export default ReviewList;

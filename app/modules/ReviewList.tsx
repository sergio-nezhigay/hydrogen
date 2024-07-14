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
            <div key={review.id} className="mb-4 border-b pb-4">
              <Text as="h3" className="font-semibold">
                {review.reviewer.name}
              </Text>
              <Text className="text-sm text-gray-500">
                {new Date(review.created_at).toLocaleDateString('uk-UA')}
              </Text>
              <Text className="mt-2">{review.body}</Text>
              <Text className="mt-2">Rating: {review.rating} / 5</Text>
              <StarRating rating={2.5} />
              {/*<StarRating rating={review.rating} />*/}
            </div>
          ))}
        </Section>
      )}
    </>
  );
}

export default ReviewList;

import {Heading, Section, Text} from '~/components/Text';
import type {JudgemeReview} from '~/lib/type';

import {StarRating} from './StarRating';

type ReviewListProps = {
  reviews: JudgemeReview[];
  title: string;
  message: string;
};

function ReviewList({reviews, title, message}: ReviewListProps) {
  return (
    <>
      {reviews.length > 0 && (
        <Section className="px-0 md:px-8 lg:px-12">
          <Heading as="h2" className="mb-4">
            {title}
          </Heading>
          <ul>
            {reviews.map((review) => (
              <li
                key={review.id}
                className="mb-6 p-4 border rounded-lg shadow-md bg-white"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Text as="h3" className="font-semibold mr-2">
                      {review.reviewer.name}
                    </Text>
                    {review.verified && (
                      <span className="text-xs text-green-600 flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
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
                        {message}
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
                <div className="mt-2 flex items-center">
                  <StarRating rating={review.rating} />
                </div>
                <Text className="mt-1">{review.body}</Text>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}

export default ReviewList;

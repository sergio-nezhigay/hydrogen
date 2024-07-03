import {useLoaderData} from '@remix-run/react';

import type {loader} from '~/routes/($locale).products.$productHandle';
import {Heading, Section, Text} from '~/components/Text';

function ProductReviews() {
  const judgemeReviews = null;
  //  const {judgemeReviews} = useLoaderData<typeof loader>();

  return (
    <Section className="px-0 md:px-8 lg:px-12">
      <Heading as="h2" className="mb-4">
        Reviews
      </Heading>
      {/*{judgemeReviews &&
        judgemeReviews.map((review) => (
          <div key={review.id} className="mb-4 border-b pb-4">
            <Text as="h3" className="font-semibold">
              {review.reviewer.name}
            </Text>
            <Text className="text-sm text-gray-500">
              {new Date(review.created_at).toLocaleDateString()}
            </Text>
            <Text className="mt-2">{review.body}</Text>
            <Text className="mt-2">Rating: {review.rating} / 5</Text>
          </div>
        ))}*/}
    </Section>
  );
}

export default ProductReviews;

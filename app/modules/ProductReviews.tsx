import {useLoaderData} from '@remix-run/react';

import {Heading, Section, Text} from '~/components/Text';

type Review = {
  id: string;
  reviewer: {
    name: string;
  };
  created_at: string;
  body: string;
  rating: number;
};

type LoaderData = {
  judgemeReviews: {
    reviews: Review[];
  };
};

function ProductReviews() {
  const {judgemeReviews} = useLoaderData<LoaderData>();
  const reviews =
    judgemeReviews && 'reviews' in judgemeReviews ? judgemeReviews.reviews : [];

  return (
    <Section className="px-0 md:px-8 lg:px-12">
      <Heading as="h2" className="mb-4">
        Reviews
      </Heading>
      {reviews.length > 0 ? (
        reviews.map((review) => (
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
        ))
      ) : (
        <Text>No reviews yet.</Text>
      )}
    </Section>
  );
}

export default ProductReviews;

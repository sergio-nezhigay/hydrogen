import {Section} from '~/components/Text';
import type {JudgemeReview} from '~/lib/type';
import {useTranslation} from '~/lib/utils';
import {Gallery} from '~/modules/Gallery';
import {Link} from '~/components/Link';

import {ReviewCard} from './ReviewList'; // Import the ReviewCard component

export type ReviewSwimlaneProps = {
  title?: string;
  reviews: JudgemeReview[];
  count?: number;
};

export function ReviewSwimlane({
  title = 'Reviews',
  reviews = [],
  count = 12,
  ...props
}: ReviewSwimlaneProps) {
  console.log('🚀 ~ reviews:', reviews);
  const {translation} = useTranslation();

  return (
    <Section
      heading={translation.reviews}
      {...props}
      padding="y"
      display="flex"
      className="flex flex-col bg-gray-50"
    >
      <Gallery
        galleryItems={reviews.slice(0, count)}
        GalleryItemComponent={ReviewCardWrapper}
        itemClasses="pl-4 lg:basis-1/2 xl:basis-1/3"
      />
    </Section>
  );
}

export type ReviewCardWrapperProps = {
  index: number;
  itemData: JudgemeReview;
};

function ReviewCardWrapper({itemData, index}: ReviewCardWrapperProps) {
  const productBaseUrl = '/products/';
  return (
    <div key={index} className="p-4 border rounded-lg shadow h-full">
      {itemData.product_handle && itemData.product_title && (
        <h3 className="font-medium text-lg">
          <Link
            to={`${productBaseUrl}${itemData.product_handle}`}
            className="text-blue-600 hover:underline"
          >
            {itemData.product_title}
          </Link>
        </h3>
      )}

      <ReviewCard review={itemData} />
    </div>
  );
}

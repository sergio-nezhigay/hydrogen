import {Section} from '~/components/Text';
import type {JudgemeReview} from '~/lib/type';
import {useTranslation} from '~/lib/utils';
import {Link} from '~/components/Link';

import {ReviewCard} from './ReviewList';
import DynamicGallery from './DynamicGallery';

export type ReviewSwimlaneProps = {
  title?: string;
  reviews: JudgemeReview[];
  count?: number;
};

export function ReviewSwimlane({
  title = 'Reviews',
  reviews = [],
  count = 16,
  ...props
}: ReviewSwimlaneProps) {
  const {translation} = useTranslation();

  return (
    <Section
      heading={translation.reviews}
      {...props}
      padding="y"
      display="flex"
      className="flex flex-col bg-gray-50 "
    >
      <DynamicGallery
        data={reviews.slice(0, count)}
        presentationComponent={ReviewCardWrapper}
        itemStyle="pl-4 lg:basis-1/2 xl:basis-1/4 h-68"
      />
    </Section>
  );
}

export type ReviewCardWrapperProps = {
  index: number;
  item: JudgemeReview;
};

function ReviewCardWrapper({item, index}: ReviewCardWrapperProps) {
  const productBaseUrl = '/products/';
  return (
    <div
      key={index}
      className="p-4 border rounded-lg shadow h-full items-start flex flex-col justify-between"
    >
      {item.product_handle && item.product_title && (
        <h3 className="font-medium h-12 line-clamp-2">
          <Link
            to={`${productBaseUrl}${item.product_handle}`}
            className="text-blue-600 hover:underline"
          >
            {item.product_title}
          </Link>
        </h3>
      )}

      <ReviewCard review={item} />
    </div>
  );
}

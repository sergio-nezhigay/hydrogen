import {Section} from '~/components/Text';
import type {JudgemeReview} from '~/lib/type';
import {useTranslation} from '~/lib/utils';
import {Gallery} from '~/modules/Gallery';

import {StarRating} from './StarRating';

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
  const {translation} = useTranslation();

  return (
    <Section
      heading={translation.reviews}
      {...props}
      padding="y"
      display="flex"
      className="flex flex-col"
    >
      <Gallery
        galleryItems={reviews.slice(0, count)}
        GalleryItemComponent={ReviewCardWrapper}
        itemClasses="pl-4 basis-1/2 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
      />
    </Section>
  );
}

export type ReviewCardWrapperProps = {
  index: number;
  itemData: JudgemeReview;
};

function ReviewCardWrapper({itemData, index}: ReviewCardWrapperProps) {
  console.log('🚀 ~ itemData:', itemData);
  const productBaseUrl = 'https://byte.com.ua/products/';
  const title = itemData.title;
  return (
    <div key={index} className="min-h-[250px] p-4 border rounded-lg shadow">
      {/* Display product title and clickable link if handle is available */}
      {itemData.product_handle && itemData.product_title && (
        <h3 className="product-title font-medium text-lg">
          <a
            href={`${productBaseUrl}${itemData.product_handle}`}
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {itemData.product_title}
          </a>
        </h3>
      )}

      {title && <h3 className="review-title font-bold">title {title}</h3>}

      <p className="font-bold text-base">
        reviewer.name {itemData.reviewer.name}
      </p>
      <p className="review-body">body {itemData.body}</p>
      <StarRating rating={itemData.rating} />
    </div>
  );
}

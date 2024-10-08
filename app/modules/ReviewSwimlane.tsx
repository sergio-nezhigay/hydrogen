import {Section} from '~/components/Text';
import type {JudgemeReview} from '~/lib/type';
import {useTranslation} from '~/lib/utils';
import {Gallery} from '~/modules/Gallery';

export type ReviewSwimlaneProps = {
  title?: string;
  reviews: JudgemeReview[];
  count?: number;
};

export function ReviewSwimlane({
  title = 'Customer Reviews',
  reviews = [],
  count = 12,
  ...props
}: ReviewSwimlaneProps) {
  const {t} = useTranslation();
  const translatedTitle = t(title);

  return (
    <Section
      heading={translatedTitle}
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

function ReviewCardWrapper({itemData}: ReviewCardWrapperProps) {
  return (
    <div className="review-card p-4 border rounded-lg shadow">
      <h3 className="review-title font-bold">{itemData.title || 'Untitled'}</h3>
      <p className="review-body">{itemData.body}</p>
      <span className="review-rating">Rating: {itemData.rating} / 5</span>
      <p className="reviewer-name text-sm">By: {itemData.reviewer.name}</p>
      <p className="reviewer-name text-sm">
        hidden: {itemData.hidden ? 'hidden' : 'visible'}
      </p>
    </div>
  );
}

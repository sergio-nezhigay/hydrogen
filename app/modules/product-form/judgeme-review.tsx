//import {useFetcher, useLoaderData} from '@remix-run/react';
//import {forwardRef, useEffect} from 'react';

//import {usePrefixPathWithLocale} from '~/lib/utils';

//import {StarRating} from '../StarRating';

////import {StarRating} from '../StarRating';
//type JudgemeReviewsData = {
//  rating: number;
//  reviewNumber: number;
//  error?: string;
//};

//const JudgemeReview = forwardRef<HTMLDivElement, HydrogenComponentProps>(
//  (props, ref) => {
//    const loaderData = useLoaderData<{
//      judgemeReviews: JudgemeReviewsData;
//    }>();
//    const judgemeReviews = loaderData?.judgemeReviews;
//    const {load, data: fetchData} = useFetcher<JudgemeReviewsData>();
//    const context = useParentInstance();
//    const handle = context?.data?.product?.handle!;
//    const api = usePrefixPathWithLocale(`/api/review/${handle}`);

//    useEffect(() => {
//      if (judgemeReviews || !handle) return;
//      load(api);
//      // eslint-disable-next-line react-hooks/exhaustive-deps
//    }, [handle, api]);
//    const data = judgemeReviews || fetchData;
//    if (!data) return null;
//    if (data.error) {
//      return (
//        <div {...props} ref={ref}>
//          {data.error}
//        </div>
//      );
//    }

//    const rating = Math.round((data.rating || 0) * 100) / 100;
//    const reviewNumber = data.reviewNumber || 0;

//    return (
//      <div {...props} ref={ref}>
//        <div className="space-x-2">
//          <StarRating rating={rating} />
//          <span className="align-top">({reviewNumber})</span>
//        </div>
//      </div>
//    );
//  },
//);

//export default JudgemeReview;

//export const schema: HydrogenComponentSchema = {
//  type: 'judgeme',
//  title: 'Judgeme review',
//  toolbar: ['general-settings', ['duplicate', 'delete']],
//  inspector: [
//    {
//      group: 'Judgeme',
//      inputs: [],
//    },
//  ],
//};

import type {JudgemeProductData, JudgemeReviewsData} from './type';

async function getInternalIdByHandle(
  api_token: string,
  shop_domain: string,
  handle: string,
) {
  const api =
    `https://judge.me/api/v1/products/-1?` +
    new URLSearchParams({
      api_token,
      shop_domain,
      handle,
    });
  const data = (await fetch(api).then((res) =>
    res.json(),
  )) as JudgemeProductData;

  return data?.product?.id;
}

export const getJudgemeReviews = async (
  api_token: string,
  shop_domain: string,
  handle: string,
): Promise<JudgemeReviewsData> => {
  const internalId = await getInternalIdByHandle(
    api_token,
    shop_domain,
    handle,
  );

  if (internalId) {
    const data = (await fetch(
      `https://judge.me/api/v1/reviews?` +
        new URLSearchParams({
          api_token,
          shop_domain,
          product_id: internalId,
        }),
    ).then((res) => res.json())) as JudgemeReviewsData;

    const reviews = data.reviews || [];

    const rating =
      reviews.reduce((acc, review) => acc + review.rating, 0) /
      (reviews.length || 1);
    return {
      rating,
      reviewNumber: reviews.length,
      reviews,
    };
  }
  return {
    rating: 0,
    reviewNumber: 0,
    reviews: [],
  };
};

export async function addJudgemeReview({
  id,
  email,
  name,
  rating,
  title,
  body,
  api_token,
  shop_domain,
}: {
  id: string;
  email: string;
  name: string;
  rating: number;
  title: string;
  body: string;
  api_token: string;
  shop_domain: string;
}) {
  const platform = 'shopify';
  const response = await fetch('https://judge.me/api/v1/reviews', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${api_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      shop_domain,
      platform,
      id,
      email,
      name,
      rating,
      title,
      body,
      verified_buyer: true,
      review_type: 'product',
    }),
  });
  console.log('arguments', {
    shop_domain,
    platform,
    id,
    email,
    name,
    rating,
    title,
    body,
    verified_buyer: true,
    review_type: 'product',
  });
  console.log('response', JSON.stringify(response));
  if (!response.ok) {
    throw new Error(`Failed to submit review: ${response.statusText}`);
  }

  return response.json();
}

export const getAllShopReviews = async (
  api_token: string,
  shop_domain: string,
  perPage = 20,
  page = 1,
) => {
  try {
    // Construct the API URL with pagination
    const apiUrl =
      `https://judge.me/api/v1/reviews?` +
      new URLSearchParams({
        api_token,
        shop_domain,
        per_page: perPage.toString(),
        page: page.toString(),
      });

    const response = await fetch(apiUrl);
    const data = (await response.json()) as JudgemeReviewsData;
    console.log('🚀 ~ data:', JSON.stringify(data.reviews));

    const list = data.reviews.filter((review) => !review.hidden);
    console.log('🚀 ~ data:', JSON.stringify(list));

    return list;
  } catch (error) {
    console.error('Error fetching shop reviews:', error);
    return null;
  }
};

//export const getAllReviewsPage = async (
//  api_token: string,
//  shop_domain: string,
//  page = 1,
//  review_type: 'product-reviews' | 'shop-reviews' = 'product-reviews',
//) => {
//  try {
//    // Construct the API URL with pagination and review type
//    const apiUrl =
//      `https://judge.me/api/v1/widgets/all_reviews_page?` +
//      new URLSearchParams({
//        api_token,
//        shop_domain,
//        page: page.toString(),
//        review_type,
//      });

//    const response = await fetch(apiUrl);
//    if (!response.ok) {
//      throw new Error(`Failed to fetch all reviews: ${response.statusText}`);
//    }

//    const data = await response.json();

//    return data; // You can modify how you handle the data based on your needs
//  } catch (error) {
//    console.error('Error fetching all reviews page:', error);
//    return null;
//  }
//};

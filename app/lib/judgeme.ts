type JudgemeProductData = {
  product: {
    id: string;
    handle: string;
  };
};

type JudgemeReviewsData = {
  reviews: {
    rating: number;
  }[];
};

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
) => {
  if (!api_token) {
    return {
      error: 'Missing JUDGEME_PUBLIC_TOKEN',
    };
  }
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
  };
};

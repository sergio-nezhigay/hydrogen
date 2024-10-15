import {getSeoMeta} from '@shopify/hydrogen';
import type {MetaArgs, LoaderFunctionArgs} from '@shopify/remix-oxygen';

import type {
  GetProductQuery,
  GetProductQueryVariables,
} from 'storefrontapi.generated';
import {addJudgemeReview} from '~/lib/judgeme';
import {seoPayload} from '~/lib/seo.server';
import {submitReviewAction} from '~/lib/utils';
import {ReviewPage} from '~/modules/ReviewPage';

export const action = async ({
  request,
  context,
  params,
}: LoaderFunctionArgs) => {
  return await submitReviewAction({request, context, params});
};

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export async function loader({request, context}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const productId = url.searchParams.get('productId');
  const name = url.searchParams.get('name');
  const email = url.searchParams.get('email');
  const title = url.searchParams.get('review_title') || '';
  const body = url.searchParams.get('review_body');
  const rating = url.searchParams.get('review_rating')
    ? parseInt(url.searchParams.get('review_rating')!)
    : undefined;

  const seo = seoPayload.noindex({
    url: request.url,
    title: 'Залишити відгук',
    description: 'Форма відгуку на товар',
  });

  if (!productId || !name || !email) {
    return {mode: 'PARAM_ERROR'};
  }

  const {product}: GetProductQuery = await context.storefront.query(
    GET_PRODUCT_QUERY,
    {
      variables: {id: productId} as GetProductQueryVariables,
    },
  );

  if (!body || !rating) {
    return {
      mode: 'GATHER',
      formData: {
        productId,
        name,
        email,
      },
      product,
    };
  }

  try {
    await addJudgemeReview({
      api_token: context.env.JUDGEME_PUBLIC_TOKEN,
      shop_domain: context.env.PUBLIC_STORE_DOMAIN,
      id: parseInt(productId),
      email,
      name,
      rating,
      title,
      body,
    });

    return {mode: 'SENT', product};
  } catch (error) {
    console.error('Error sending review:', error);
    return {mode: 'SEND_ERROR'};
  }
}

const GET_PRODUCT_QUERY = `#graphql
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      title
      images(first: 1) {
        edges {
          node {
            url
            altText
            height
            width
          }
        }
      }
    }
  }
`;

export default function ReviewRoute() {
  return <ReviewPage />;
}

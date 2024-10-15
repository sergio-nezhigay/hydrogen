import {useActionData, useLoaderData} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';

import {Section} from '~/components/Text';
import {useTranslation} from '~/lib/utils';
import {ReviewForm} from '~/modules/ReviewForm';
import type {action} from '~/routes/($locale).review';
import type {LoaderData} from '~/types/review';

export function ReviewPage() {
  const data = useLoaderData<LoaderData>();
  console.log('🚀 ~ data:', data);
  const actionData = useActionData<typeof action>();
  console.log('🚀 ~ actionData:', actionData);
  const {translation} = useTranslation();
  if (!data) return <p>No data error</p>;

  const {mode, product, formData} = data;

  return (
    <>
      {product?.title && (
        <Section
          heading={product.title}
          headingClassName="text-center mx-auto"
          padding="y"
          useH1
          className="py-8"
        >
          <div className="w-20 mx-auto">
            <Image
              data={product.images.edges[0].node}
              sizes="auto"
              className="object-cover rounded"
              aspectRatio="1/1"
            />
          </div>

          {(mode === 'SENT' || actionData?.success) && (
            <Message type="success" text={translation.review_thanks_message} />
          )}

          {mode === 'PARAM_ERROR' && (
            <Message
              type="error"
              text="Error: Missing required parameters. Please check your input."
            />
          )}

          {mode === 'SEND_ERROR' && (
            <Message
              type="error"
              text="Error: There was an issue sending your review. Please try again later."
            />
          )}

          {mode === 'GATHER' && !actionData?.success && formData && (
            <ReviewForm
              productId={formData.productId}
              name={formData.name}
              email={formData.email}
              isInitialVisible={true}
            />
          )}
        </Section>
      )}
    </>
  );
}

interface MessageProps {
  type: 'success' | 'error';
  text: string;
}

const Message = ({type, text}: MessageProps) => (
  <div
    className={`p-4 rounded ${
      type === 'success' ? 'bg-green-100' : 'bg-red-100'
    }`}
  >
    <p className="font-bold text-xl text-center">{text}</p>
  </div>
);

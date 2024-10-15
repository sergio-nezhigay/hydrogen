import {useLoaderData} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';

import {ReviewForm} from '~/modules/ReviewForm';
import type {LoaderData} from '~/types/review';

export function ReviewPage() {
  const data = useLoaderData<LoaderData>();

  if (!data) return <p>No data error</p>;

  const {mode, product, formData} = data;

  return (
    <div className="p-4">
      {product && (
        <>
          <h1 className="text-xl font-bold mb-4">{product.title}</h1>
          <div className="w-20 mx-auto">
            <Image
              data={product.images.edges[0].node}
              sizes="auto"
              className="object-cover rounded"
              aspectRatio="1/1"
            />
          </div>
        </>
      )}

      {mode === 'SENT' && (
        <Message
          type="success"
          text="Thank you for sending your review! It will help us and our customers."
        />
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

      {mode === 'GATHER' && formData && (
        <ReviewForm
          productId={formData.productId}
          name={formData.name}
          email={formData.email}
          isInitialVisible={true}
        />
      )}
    </div>
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
    <p>{text}</p>
  </div>
);

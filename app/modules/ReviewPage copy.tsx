import {useLoaderData} from '@remix-run/react';

import type {LoaderData} from '~/types/review';

export function ReviewPage() {
  const data = useLoaderData<LoaderData>();

  if (!data) return <p>No data error</p>;

  const {mode, product, formData} = data;

  return <>{product?.title && <div>asdfasdf</div>}</>;
}

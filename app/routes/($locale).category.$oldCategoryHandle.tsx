// app/routes/($locale).category.$oldCategoryHandle.tsx
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {redirect} from '@shopify/remix-oxygen';

export const loader = async ({params}: LoaderFunctionArgs) => {
  const {oldCategoryHandle} = params;

  return redirect(`/collections/${oldCategoryHandle}`, 301);
};

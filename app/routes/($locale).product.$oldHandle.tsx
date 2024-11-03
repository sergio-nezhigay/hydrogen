import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {redirect} from '@shopify/remix-oxygen';

export const loader = async ({params}: LoaderFunctionArgs) => {
  const {oldHandle} = params;

  return redirect(`/products/${oldHandle}`, 302);
};

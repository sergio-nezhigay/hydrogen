import type {HeadersFunction, LoaderFunctionArgs} from '@shopify/remix-oxygen';

export async function loader({params, request, context}: LoaderFunctionArgs) {
  return context.customerAccount.login({
    uiLocales: 'UA', // will be used instead of the one coming from the context
  });
}

export const headers: HeadersFunction = ({actionHeaders}) => actionHeaders;

import type {CartLineInput} from '@shopify/hydrogen/storefront-api-types';
import {CartForm} from '@shopify/hydrogen';
import type {FetcherWithComponents} from '@remix-run/react';

import {Button} from './ui/button';

//import {Button} from '~/components/Button';

export function AddToCartButton({
  children,
  lines,
  className = '',
  variant = 'default',
  width = 'full',
  disabled,
  delta,
  meta,
  ...props
}: {
  children: React.ReactNode;
  lines: CartLineInput[];
  className?: string;
  variant?: 'default' | 'outline' | 'accent' | 'red';
  width?: 'auto' | 'full';
  disabled?: boolean;
  delta: string;
  meta: {delta: string; supplier: string};
  [key: string]: any;
}) {
  console.log('add to cart button delta:', JSON.stringify(delta, null, 4));
  console.log('add to cart button delta:', JSON.stringify(meta.delta, null, 4));
  console.log(
    'add to cart button delta:',
    JSON.stringify(meta.supplier, null, 4),
  );
  return (
    <CartForm
      route="/cart"
      inputs={{
        lines,
        supplier: meta.supplier,
        delta: meta.delta,
      }}
      action={CartForm.ACTIONS.LinesAdd}
    >
      {(fetcher: FetcherWithComponents<any>) => {
        return (
          <>
            <Button
              type="submit"
              variant="red"
              size="lg"
              className={className}
              disabled={disabled ?? fetcher.state !== 'idle'}
              {...props}
            >
              {children}
            </Button>
          </>
        );
      }}
    </CartForm>
  );
}

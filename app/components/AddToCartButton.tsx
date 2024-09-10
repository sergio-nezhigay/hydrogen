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
  ...props
}: {
  children: React.ReactNode;
  lines: CartLineInput[];
  className?: string;
  variant?: 'default' | 'outline' | 'accent' | 'red';
  width?: 'auto' | 'full';
  disabled?: boolean;
  delta: string;
  [key: string]: any;
}) {
  console.log(
    '===== LOG START =====',
    new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
  );
  console.log('add to cart button delta:', JSON.stringify(delta, null, 4));
  return (
    <CartForm
      route="/cart"
      inputs={{
        lines,
        delta,
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

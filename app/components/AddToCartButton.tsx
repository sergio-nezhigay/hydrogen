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
  ...props
}: {
  children: React.ReactNode;
  lines: CartLineInput[];
  className?: string;
  variant?: 'default' | 'outline' | 'accent' | 'red';
  width?: 'auto' | 'full';
  disabled?: boolean;
  [key: string]: any;
}) {
  console.log('🚀 ~ lines:', lines);
  return (
    <CartForm
      route="/cart"
      inputs={{
        lines,
        attributes: [
          {
            key: 'TotalIncome',
            value: 333,
          },
        ],
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

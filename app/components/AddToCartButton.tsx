import {type FetcherWithComponents} from '@remix-run/react';
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';
import {ShoppingCart} from 'lucide-react';

import {Button} from './ui/button';

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
  delta,
  meta,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: () => void;
  delta: string;
  meta: {delta: string; supplier: string};
}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <Button
            type="submit"
            variant="red"
            size="lg"
            onClick={onClick}
            disabled={disabled ?? fetcher.state !== 'idle'}
            className="sm-max:w-full  "
          >
            <ShoppingCart className="mr-4 size-6" />
            {children}
          </Button>
        </>
      )}
    </CartForm>
  );
}

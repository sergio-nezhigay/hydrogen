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
  cost_copy,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: () => void;
  cost_copy: string;
}) {
  return (
    <CartForm
      route="/cart"
      inputs={{lines, cost_copy}}
      action={CartForm.ACTIONS.LinesAdd}
    >
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

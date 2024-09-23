import {type FetcherWithComponents} from '@remix-run/react';
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';
import {Button} from './ui/button';
import {ShoppingCart} from 'lucide-react';

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
  console.log('add to cart button delta:', JSON.stringify(delta, null, 4));
  console.log('add to cart button delta:', JSON.stringify(meta.delta, null, 4));
  console.log(
    'add to cart button delta:',
    JSON.stringify(meta.supplier, null, 4),
  );
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
          >
            <ShoppingCart className="mr-4 size-6" />
            {children}
          </Button>
        </>
      )}
    </CartForm>
  );
}

import {useOptimisticCart} from '@shopify/hydrogen';

import {Text} from '~/components/Text';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {CartLineItem} from '~/components/CartLineItem';
import {useTranslation} from '~/lib/utils';

import {Button} from './ui/button';
import {CartSummary} from './CartSummary';
import {FeaturedProducts} from './FeaturedProducts';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 */
export function CartMain({layout, cart: originalCart}: CartMainProps) {
  // The useOptimisticCart hook applies pending actions to the cart
  // so the user immediately sees feedback when they modify the cart.
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);

  const cartHasItems = cart?.totalQuantity! > 0;

  const className = `${
    layout === 'page'
      ? 'w-full pb-12 grid md:grid-cols-2 md:items-start gap-8 md:gap-8 lg:gap-12'
      : 'grid grid-cols-1 h-screen-no-nav grid-rows-[1fr_auto] py-4'
  }`;

  return (
    <div className={className}>
      <CartEmpty hidden={linesCount} layout={layout} />

      <ul className="space-y-8">
        {(cart?.lines?.nodes ?? []).map((line) => (
          <CartLineItem key={line.id} line={line} layout={layout} />
        ))}
      </ul>

      {cartHasItems && <CartSummary cart={cart} layout={layout} />}
    </div>
  );
}

function CartEmpty({
  hidden = false,
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  const {close} = useAside();
  const {translation} = useTranslation();

  return (
    <div hidden={hidden}>
      <section className="grid gap-6 py-6">
        <Text format size="lead">
          {translation.no_items_added_yet}
        </Text>
        <div>
          <Button onClick={close}>{translation.continue_shopping}</Button>
        </div>
      </section>
      <section className="grid gap-8">
        <FeaturedProducts
          count={2}
          heading={translation.trending_products}
          layout="drawer"
          onClose={close}
          sortKey="BEST_SELLING"
        />
      </section>
    </div>
    //<div hidden={hidden}>
    //  <br />
    //  <p>
    //    Looks like you haven&rsquo;t added anything yet, let&rsquo;s get you
    //    started!
    //  </p>
    //  <br />
    //  <Link to="/collections" onClick={close} prefetch="viewport">
    //    Continue shopping →
    //  </Link>
    //</div>
  );
}

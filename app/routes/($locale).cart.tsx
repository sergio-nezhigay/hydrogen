import {Await, type MetaFunction, useRouteLoaderData} from '@remix-run/react';
import {Suspense} from 'react';
import type {CartQueryDataReturn} from '@shopify/hydrogen';
import {CartForm} from '@shopify/hydrogen';
import {json, type ActionFunctionArgs} from '@shopify/remix-oxygen';

import {CartMain} from '~/components/CartMain';
import type {RootLoader} from '~/root';
import {useTranslation} from '~/lib/utils';

export const meta: MetaFunction = () => {
  return [{title: `Кошик`}];
};

export async function action({request, context}: ActionFunctionArgs) {
  const {cart} = context;

  const formData = await request.formData();

  const {action, inputs} = CartForm.getFormInput(formData);

  if (!action) {
    throw new Error('No action provided');
  }

  let status = 200;
  let result: CartQueryDataReturn;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      const discountCode = inputs.lines[0]?.attributes?.find(
        (attr) => attr.key === 'discountCode',
      )?.value as string;
      if (discountCode) {
        await cart.updateDiscountCodes([discountCode]);
      }

      const attributes = [];
      if (inputs.delta) {
        attributes.push({
          key: 'delta',
          value: inputs.delta as string,
        });
      }
      await cart.updateAttributes(attributes);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    case CartForm.ACTIONS.DiscountCodesUpdate: {
      const formDiscountCode = inputs.discountCode;

      // User inputted discount code
      const discountCodes = (
        formDiscountCode ? [formDiscountCode] : []
      ) as string[];

      // Combine discount codes already applied on cart
      discountCodes.push(...inputs.discountCodes);

      result = await cart.updateDiscountCodes(discountCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesUpdate: {
      const formGiftCardCode = inputs.giftCardCode;

      // User inputted gift card code
      const giftCardCodes = (
        formGiftCardCode ? [formGiftCardCode] : []
      ) as string[];

      // Combine gift card codes already applied on cart
      giftCardCodes.push(...inputs.giftCardCodes);

      result = await cart.updateGiftCardCodes(giftCardCodes);
      break;
    }
    case CartForm.ACTIONS.BuyerIdentityUpdate: {
      result = await cart.updateBuyerIdentity({
        ...inputs.buyerIdentity,
      });
      break;
    }
    default:
      throw new Error(`${action} cart action is not defined`);
  }

  const cartId = result?.cart?.id;
  const headers = cartId ? cart.setCartId(result.cart.id) : new Headers();
  const {cart: cartResult, errors} = result;

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string') {
    status = 303;
    headers.set('Location', redirectTo);
  }

  return json(
    {
      cart: cartResult,
      errors,
      analytics: {
        cartId,
      },
    },
    {status, headers},
  );
}

export default function Cart() {
  const rootData = useRouteLoaderData<RootLoader>('root');
  const {translation} = useTranslation();
  if (!rootData) return null;

  return (
    <section>
      <div className="container mx-auto">
        <h1 className="whitespace-pre-wrap max-w-prose font-bold text-lead px-6 md:px-8 lg:px-12 py-6">
          {translation.basket}
        </h1>
        <Suspense fallback={`${translation.loading}...`}>
          <Await
            resolve={rootData.cart}
            errorElement={<div>An error occurred</div>}
          >
            {(cart) => {
              console.log('🚀 ~ cart:', cart);
              return <CartMain layout="page" cart={cart} />;
            }}
          </Await>
        </Suspense>
      </div>
    </section>
  );
}

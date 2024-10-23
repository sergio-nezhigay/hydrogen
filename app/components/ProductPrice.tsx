import {Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';
import clsx from 'clsx';

import {HryvniaMoney} from '~/components/HryvniaMoney';

export function ProductPrice({
  price,
  compareAtPrice,
}: {
  price?: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
}) {
  return (
    <div className="product-price text-2xl">
      {compareAtPrice ? (
        <div className="product-price-on-sale">
          {price ? <HryvniaMoney data={price} /> : null}
          <s>
            <HryvniaMoney data={compareAtPrice} />
          </s>
        </div>
      ) : price ? (
        <HryvniaMoney data={price} />
      ) : (
        <span>&nbsp;</span>
      )}
    </div>
  );
}

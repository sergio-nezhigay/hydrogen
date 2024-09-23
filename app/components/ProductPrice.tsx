import {Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';
import clsx from 'clsx';

export function ProductPrice({
  price,
  compareAtPrice,
}: {
  price?: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
}) {
  return (
    <div className="product-price">
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

interface HryvniaMoneyProps {
  data: MoneyV2;
  className?: string;
}

function HryvniaMoney({data, className}: HryvniaMoneyProps) {
  return (
    <span className={clsx('font-bold', className)}>
      <Money
        data={data!}
        as="span"
        withoutTrailingZeros
        withoutCurrency
        data-test="price"
      />
      <span className="ml-1 text-base">₴</span>
    </span>
  );
}

export default HryvniaMoney;

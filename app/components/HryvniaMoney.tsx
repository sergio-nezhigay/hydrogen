import {Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';
import clsx from 'clsx';

interface HryvniaMoneyProps {
  data: MoneyV2;
  className?: string;
}

function HryvniaMoney({data, className}: HryvniaMoneyProps) {
  return (
    <div className={clsx('font-bold', className)}>
      <Money
        data={data!}
        as="span"
        withoutTrailingZeros
        withoutCurrency
        data-test="price"
      />
      <span className="ml-1 text-base">₴</span>
    </div>
  );
}

export default HryvniaMoney;

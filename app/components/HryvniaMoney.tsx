import {Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';

interface HryvniaMoneyProps {
  data: MoneyV2;
  className?: string;
}

function HryvniaMoney({data, className = ''}: HryvniaMoneyProps) {
  return (
    <div className={className}>
      <Money
        data={data!}
        as="span"
        withoutTrailingZeros
        withoutCurrency
        data-test="price"
      />
      <span className="ml-1 text-sm">₴</span>
    </div>
  );
}

export default HryvniaMoney;

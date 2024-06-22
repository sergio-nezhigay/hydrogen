import {Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';

interface HryvniaMoneyProps {
  data: MoneyV2;
}

function HryvniaMoney({data}: HryvniaMoneyProps) {
  return (
    <div>
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

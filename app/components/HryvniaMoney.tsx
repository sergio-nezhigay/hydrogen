import {Money} from '@shopify/hydrogen';
import clsx from 'clsx';

interface HryvniaMoneyProps {
  data: any;
  className?: string;
}

export function HryvniaMoney({data, className}: HryvniaMoneyProps) {
  return (
    <span className={clsx('font-bold', className)}>
      <Money
        data={data}
        as="span"
        withoutTrailingZeros
        withoutCurrency
        data-test="price"
      />
      <span className="ml-1 text-base">₴₴</span>
    </span>
  );
}

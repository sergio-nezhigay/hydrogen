import type {FC} from 'react';
import {ShieldCheck, Truck, CreditCard, Gift} from 'lucide-react';

import {useTranslation} from '~/lib/utils';

interface ShippingPaymentWarrantyProps {
  warrantyTerm?: string;
}

export const ShippingPaymentWarranty: FC<ShippingPaymentWarrantyProps> = ({
  warrantyTerm = '12',
}) => {
  const {t} = useTranslation();
  const rows = [
    {
      icon: <ShieldCheck />,
      label: t('Warranty'),
      description: t('Warranty Description', {warrantyTerm}),
    },
    {
      icon: <Truck />,
      label: t('Delivery'),
      description: t('Delivery Description'),
    },
    {
      icon: <CreditCard />,
      label: t('Payment'),
      description: t('Payment Description'),
    },
    {
      icon: <Gift />,
      label: t('Bonus'),
      description: t('Bonus Description'),
    },
  ];

  return (
    <div className="grid gap-2 w-fit grid-cols-[auto,1fr] opacity-80">
      {rows.map((row, index) => (
        <>
          <div className="flex space-x-3">
            <span className="size-6 opacity-60">{row.icon}</span>
            <span className="font-bold">{row.label}:</span>
          </div>
          <span>{row.description}</span>
          {index < rows.length - 1 && (
            <div className="col-span-2 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-[100%] mx-auto"></div>
          )}
        </>
      ))}
    </div>
  );
};

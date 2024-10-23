import type {FC} from 'react';
import {ShieldCheck, Truck, CreditCard, Gift} from 'lucide-react';

interface ShippingPaymentWarrantyProps {
  warrantyTerm?: number;
}

export const ShippingPaymentWarranty: FC<ShippingPaymentWarrantyProps> = ({
  warrantyTerm = 12,
}) => {
  const rows = [
    {
      icon: <ShieldCheck />,
      label: 'Гарантія',
      description: `${warrantyTerm} місяців. Обмін/повернення товару впродовж 14 днів`,
    },
    {
      icon: <Truck />,
      label: 'Доставка',
      description: "Нова Пошта на відділення/поштомат або кур'єр на адресу",
    },
    {
      icon: <CreditCard />,
      label: 'Оплата',
      description: 'При отриманні або передплата',
    },
    {
      icon: <Gift />,
      label: 'Бонус',
      description: '+ 20 грн бонус при купівлі цього товару',
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

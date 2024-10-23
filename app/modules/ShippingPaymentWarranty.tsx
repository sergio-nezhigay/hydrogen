import type {FC} from 'react';
import {ShieldCheck, Truck, CreditCard} from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';

interface ShippingPaymentWarrantyProps {
  warrantyTerm?: number;
}

export const ShippingPaymentWarranty: FC<ShippingPaymentWarrantyProps> = ({
  warrantyTerm = 12,
}) => {
  return (
    <div className="shadow grid gap-4 grid-cols-[auto,1fr] opacity-90 rounded-md p-4">
      <div className="flex space-x-3">
        <ShieldCheck className="w-6 h-6 opacity-60" />
        <span className="font-bold">Гарантія:</span>
      </div>
      <span>
        {warrantyTerm} місяців. Обмін/повернення товару впродовж 14 днів
      </span>

      <div className="col-span-2 h-px bg-gray-200 w-[95%] mx-auto"></div>

      <div className="flex space-x-3">
        <Truck className="w-6 h-6 opacity-60" />
        <span className="font-bold">Доставка:</span>
      </div>
      <span>Нова Пошта на відділення/поштомат або кур&apos;єр на адресу</span>

      <div className="col-span-2 h-px bg-gray-200 w-[95%] mx-auto"></div>
      <div className="flex space-x-3">
        <CreditCard className="w-6 h-6 opacity-60" />
        <span className="font-bold">Оплата:</span>
      </div>
      <span>При отриманні або передплата</span>
    </div>
  );
};

import type {FC} from 'react';
import {ShieldCheck, Truck, CreditCard} from 'lucide-react';

interface ShippingPaymentWarrantyProps {
  warrantyTerm?: number;
}

const ShippingPaymentWarranty: FC<ShippingPaymentWarrantyProps> = ({
  warrantyTerm = 12,
}) => {
  return (
    <div className="grid text-sm grid-cols-2 md:grid-cols-1 lg:grid-cols-[37fr,37fr,26fr] gap-6 border p-4 rounded-md">
      {/* Гарантія */}
      <div>
        <div className="flex items-center mb-2">
          <ShieldCheck className="w-6 h-6 mr-2" />
          <h3 className="font-bold">Гарантія</h3>
        </div>
        <ul className="list-disc list-inside marker:text-stone-400">
          <li>{warrantyTerm} місяців</li>
          <li>Обмін/повернення за 14 днів</li>
        </ul>
      </div>

      {/* Доставка */}
      <div>
        <div className="flex items-center mb-2">
          <Truck className="w-6 h-6 mr-2" />
          <h3 className="font-bold">Доставка Нова Пошта</h3>
        </div>
        <ul className="list-disc list-inside marker:text-stone-400">
          <li>На відділення/поштомат</li>
          <li>Доставка кур&apos;єром на адресу</li>
          <li>Самовивіз в Києві</li>
        </ul>
      </div>

      {/* Оплата */}
      <div>
        <div className="flex items-center mb-2">
          <CreditCard className="w-6 h-6 mr-2" />
          <h3 className="font-bold">Оплата</h3>
        </div>
        <ul className="list-disc list-inside marker:text-stone-400">
          <li>При отриманні </li>
          <li>Передплата</li>
        </ul>

        {/*<p className="text-sm">При отриманні або по реквізитах</p>*/}
      </div>
    </div>
  );
};

export default ShippingPaymentWarranty;

import {Truck, DollarSign, MessageCircle, Headphones} from 'lucide-react';

export const ServiceInfo = () => {
  return (
    <div className="flex flex-col md:flex-row justify-around items-center gap-6 p-6 bg-white shadow-lg">
      <div className="flex items-center space-x-3 text-center">
        <Truck className="text-blue-500 w-6 h-6" />
        <div>
          <h3 className="font-semibold">Fast Shipping & Returns</h3>
          <p className="text-sm text-gray-600">
            Delivery within 1-2 business days
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3 text-center">
        <DollarSign className="text-blue-500 w-6 h-6" />
        <div>
          <h3 className="font-semibold">Money-Back Guarantee</h3>
          <p className="text-sm text-gray-600">
            100% money-back guarantee within 14 days
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3 text-center">
        <MessageCircle className="text-blue-500 w-6 h-6" />
        <div>
          <h3 className="font-semibold">Customer Support</h3>
          <p className="text-sm text-gray-600">
            Assistance by phone and live chat
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3 text-center">
        <Headphones className="text-blue-500 w-6 h-6" />
        <div>
          <h3 className="font-semibold">Professional Consultation</h3>
          <p className="text-sm text-gray-600">
            Detailed guidance on product selection
          </p>
        </div>
      </div>
    </div>
  );
};

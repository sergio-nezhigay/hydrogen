import {useState} from 'react';
import {Image} from '@shopify/hydrogen';

export function HeroSection() {
  const [showContact, setShowContact] = useState(false);

  const handleContactClick = () => {
    setShowContact(true);
  };

  return (
    <section className="relative w-full h-[80vh] min-h-[400px] lg:h-[600px] flex items-center justify-center text-white">
      <Image
        src="https://cdn.shopify.com/s/files/1/0868/0462/7772/files/58-DALL_E_2024-10-06_11.15.19.webp?v=1728204762"
        width={1920}
        height={1080}
        className="absolute inset-0 object-cover w-full h-full object-[center_70%] lg:object-[center_80%]"
        alt="Hero Banner"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-stone-700 via-stone-900 to-stone-800 opacity-70 lg:opacity-60" />

      {/* Content */}
      <div className="relative z-10 text-center space-y-4 px-4">
        <h1 className="text-3xl lg:text-5xl font-bold animate-fade-in">
          Explore the Best Computer Parts and Adapters
        </h1>
        <p className="text-sm lg:text-lg animate-slide-in text-gray-200">
          Your one-stop shop for top-quality products.
        </p>
        <button
          onClick={handleContactClick}
          className="px-6 py-3 mt-4 bg-white text-indigo-800 rounded-lg hover:bg-indigo-700 hover:text-white transition-all"
        >
          Call Us for Advice
        </button>

        {/* Contact Info (visible when CTA is clicked) */}
        {showContact && (
          <div className="mt-4 text-lg">
            <p>
              Call us at: <strong>(099) 381-5288</strong>
            </p>
          </div>
        )}
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes fade-in {
            0% { opacity: 0; transform: scale(0.9); }
            100% { opacity: 1; transform: scale(1); }
          }
          @keyframes slide-in {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in { animation: fade-in 1s ease-in-out; }
          .animate-slide-in { animation: slide-in 1s ease-in-out 0.5s; }
        `}
      </style>
    </section>
  );
}

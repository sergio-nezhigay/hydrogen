import {useState, useEffect} from 'react';
import {Image} from '@shopify/hydrogen';

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Start transitions after the component mounts
    setIsVisible(true);
  }, []);

  return (
    <section className="relative w-full h-[80vh] min-h-[400px] lg:h-[700px] flex items-center justify-center text-white">
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
      <div className="relative z-10 text-center px-4">
        <h1
          className={`text-3xl lg:text-5xl transform font-bold transition-all duration-500 ease-in-out ${
            isVisible
              ? 'opacity-100  translate-y-0'
              : 'opacity-0  translate-y-4'
          }`}
        >
          Explore the Best Computer Parts and Adapters
        </h1>
        <p
          className={`text-sm lg:text-lg text-gray-200 transform transition-all duration-500 ease-in-out delay-300 ${
            isVisible
              ? 'opacity-100  translate-y-0'
              : 'opacity-0  translate-y-4'
          }`}
        >
          Your one-stop shop for top-quality products.
        </p>
        <button
          className={`px-6 py-3 mt-4 bg-white transform text-indigo-800 rounded-lg hover:bg-indigo-700 hover:text-white transition-all duration-500 ease-in-out delay-1000 ${
            isVisible
              ? 'opacity-100  translate-y-0'
              : 'opacity-0  translate-y-4'
          }`}
        >
          Call Us for Advice
        </button>
      </div>
    </section>
  );
}

import {useState, useEffect} from 'react';
import {Image} from '@shopify/hydrogen';

import {cn, useTranslation} from '~/lib/utils';
import {Link} from '~/components/Link';
const phoneNumber = '+380507025777';

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const {translation} = useTranslation();

  useEffect(() => {
    setIsVisible(true);
  }, []);
  const buttonStyle =
    'inline-block px-6 py-3 mt-4 bg-white/90 text-indigo-800 rounded-lg hover:bg-indigo-700 hover:text-white transition-color';

  return (
    <section className="relative w-full min-h-[200px] h-[70vh] lg:h-[700px] flex sm-max:content-start md:content-center align-center sm-max:pt-[200px]  md:flex-center text-white">
      <Image
        src="https://cdn.shopify.com/s/files/1/0868/0462/7772/files/58-DALL_E_2024-10-06_11.15.19.webp?v=1728204762"
        //crop="bottom"
        className="absolute inset-0 h-full object-cover object-[center_90%]"
        alt="Комп'ютер майбутнього"
        sizes="100vw"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-stone-700 via-stone-900 to-stone-800 opacity-80 lg:opacity-50" />

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <h1
          className={`text-3xl lg:text-5xl transform font-bold transition-all duration-300 ease-in-out ${
            isVisible
              ? 'opacity-100  translate-y-0'
              : 'opacity-0  translate-y-4'
          }`}
        >
          {translation.hero_title}
        </h1>
        <p
          className={`text-sm lg:text-lg text-gray-200 transform transition-all duration-300 ease-in-out delay-300 ${
            isVisible
              ? 'opacity-100  translate-y-0'
              : 'opacity-0  translate-y-4'
          }`}
        >
          {translation.hero_description}
        </p>
        <div
          className={`transition-all duration-1000 ease-in-out delay-1000 ${
            isVisible
              ? 'opacity-100  translate-y-0'
              : 'opacity-0  translate-y-4'
          }`}
        >
          <a
            href={`tel:${phoneNumber}`}
            className={cn('md:hidden ', buttonStyle)}
          >
            {translation.hero_button}
          </a>
          <Link
            to={`/pages/contact`}
            className={cn('sm-max:hidden ', buttonStyle)}
          >
            {translation.hero_button}
          </Link>
        </div>
      </div>
    </section>
  );
}

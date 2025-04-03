import {Image} from '@shopify/hydrogen';

import {Link} from '~/components/Link';
import {useTranslation} from '~/lib/utils';

function BannerLine() {
  const {t} = useTranslation();
  return (
    <>
      <div className="container h-[150px] sm:uppercase flex mb-10 gap-4 overflow-hidden ">
        <Link
          to="/collections/mice"
          className="w-[40%] p-4 xl:p-8 flex flex-col justify-end relative text-white bg-[#242529] h-full flex-1 text-right"
        >
          <p className="text-sm md:text-lg xl:text-[24px] opacity-50 xl:mb-6">
            {t('Best models')}
          </p>
          <h3 className="xl:text-outline relative z-10 text-sm md:text-[20px]  font-medium ">
            {t('Computer mice')}
          </h3>
          <div className="w-[60%] md:w-[130px] lg:w-[150px] xl:w-[200px] absolute top-[0px] xl:-top-[20px] left-[30px] lg:left-[50px]">
            <Image
              src="https://cdn.shopify.com/s/files/1/0868/0462/7772/files/910-006560-1000x1000.webp?v=1731267726"
              width={200}
              height={200}
              alt="Computer mouse"
              className="h-full w-full object-cover"
              sizes="30vw"
            />
          </div>
        </Link>

        <div className="relative p-4 xl:p-12 w-[60%] text-[#272b2e] h-full   flex flex-col justify-center items-end whitespace-pre-wrap">
          <h3 className="text-outline text-[20px] xl:text-[24px] relative font-medium text-right">
            {t('Best elecronics to present')}
          </h3>
          <Image
            src="https://cdn.shopify.com/s/files/1/0868/0462/7772/files/shop36_home_banner4_1.jpg?v=1731268793"
            className="h-full w-full block absolute object-cover inset-0 -z-10"
            sizes="60vw"
          />
        </div>
      </div>
    </>
  );
}

export default BannerLine;

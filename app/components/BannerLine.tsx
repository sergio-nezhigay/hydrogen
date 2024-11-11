import React from 'react';
import {Image} from '@shopify/hydrogen';

function BannerLine() {
  return (
    <>
      <div className="container h-[150px] uppercase flex mb-10 gap-4 overflow-hidden ">
        <div className="w-[40%] p-3 flex flex-col justify-end relative text-white bg-[#242529] h-full flex-1 text-right">
          <p className="opacity-50 ">Best models</p>
          <h3 className="text-[27px] font-medium ">Computer mice</h3>
          <div className="w-[200px] absolute top-[0px] left-[30px]">
            <Image
              src="https://cdn.shopify.com/s/files/1/0868/0462/7772/files/910-006560-1000x1000.webp?v=1731267726"
              className="block w-full h-auto "
            />
          </div>
        </div>
        <div className="relative p-2 w-[60%] text-[#272b2e] h-full   flex flex-col justify-center items-end ">
          <h3 className="text-[20px] relative z-10 font-medium text-right">
            Best elecrtonics to present
          </h3>
          <Image
            src="https://cdn.shopify.com/s/files/1/0868/0462/7772/files/shop36_home_banner4_1.jpg?v=1731268793"
            className="h-full block absolute object-cover inset-0"
          />
        </div>
      </div>
    </>
  );
}

export default BannerLine;

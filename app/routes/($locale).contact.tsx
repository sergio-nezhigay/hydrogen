import { useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { translations } from '~/data/translations';

export async function loader(args: LoaderFunctionArgs) {
    const {locale = 'uk'} = args.params;
    const translation = translations[locale as keyof typeof translations];

    return ({ translation });
  };

  export default function Contact() {
    const { translation } = useLoaderData<typeof loader>();
  
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">{translation.contact}</h1>
        <div className="mb-4 flex items-center">
          <span role="img" aria-label="phone" className="mr-2">📞</span>
          <h3 className="text-xl font-semibold">{translation.phone}:</h3>
          <p className="ml-2">(099) 381-5288</p>
        </div>
        <div className="mb-4 flex items-center">
          <span role="img" aria-label="clock" className="mr-2">🕒</span>
          <h3 className="text-xl font-semibold">{translation.hours}:</h3>
          <div className="ml-2">
            <p>{translation.hours_weekdays}</p>
            <p>{translation.hours_weekends}</p>
          </div>
        </div>
        <div className="mb-4 flex items-center">
          <span role="img" aria-label="email" className="mr-2">📧</span>
          <h3 className="text-xl font-semibold">{translation.email}:</h3>
          <p className="ml-2">info@informatica.com.ua</p>
        </div>
        <div className="flex items-center">
          <span role="img" aria-label="location" className="mr-2">📍</span>
          <h3 className="text-xl font-semibold">{translation.address}:</h3>
          <p className="ml-2">{translation.address_details}</p>
        </div>
      </div>
    );
  }
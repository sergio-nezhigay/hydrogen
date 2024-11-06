import {useAnalytics} from '@shopify/hydrogen';
import {subscribe} from 'graphql';
import {useEffect} from 'react';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export function GoogleTagManager() {
  const {register, subscribe} = useAnalytics();
  const {ready} = register('Google Tag Manager');

  useEffect(() => {
    subscribe('product_viewed', () => {
      // Triggering a custom event in GTM when a product is viewed
      window.dataLayer.push({event: 'viewed-product'});
    });
    subscribe('page_viewed', (data) => {
      console.log('CustomAnalytics - Page viewed:', data);
      window.dataLayer.push({
        event: 'shopify_page_view',
        page: data.url,
      });
    });
    ready();
  }, []);

  return null;
}

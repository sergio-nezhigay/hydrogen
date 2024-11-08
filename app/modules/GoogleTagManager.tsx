import {useAnalytics} from '@shopify/hydrogen';
import {subscribe} from 'graphql';
import {useEffect} from 'react';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export function GoogleTagManager() {
  const {register, subscribe, canTrack} = useAnalytics();
  const {ready} = register('Google Tag Manager');

  useEffect(() => {
    setTimeout(() => {
      const isTrackingAllowed = canTrack();
      console.log('CustomAnalytics - isTrackingAllowed', isTrackingAllowed);
    }, 1000);
    subscribe('product_viewed', (data) => {
      // Triggering a custom event in GTM when a product is viewed
      console.log('CustomAnalytics - Product viewed:', data);
      const product = data?.products?.[0];
      const items = product
        ? [
            {
              item_id: product.id,
              item_name: product.title,
              price: parseFloat(product.price),
              quantity: product.quantity || 1,
            },
          ]
        : [];
      const value = product ? parseFloat(product.price) : 0;
      const content = {
        event: 'view_item',
        url: data.url,
        ecommerce: {
          currency: 'UAH',
          value,
          items,
        },
      };
      console.log('content=', content);
      window.dataLayer.push(content);
    });
    subscribe('search_viewed', (data) => {
      console.log('from hydrogen search_submitted event data', data);
    });

    subscribe('collection_viewed', (data) => {
      console.log('from hydrogen code collection_viewed event', data);
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

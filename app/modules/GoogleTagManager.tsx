import {useAnalytics} from '@shopify/hydrogen';
import {useEffect} from 'react';
import {useLoaderData} from '@remix-run/react';

import type {loader} from '~/root';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export function GoogleTagManager() {
  const {subscribe, register, canTrack} = useAnalytics();

  const {ready} = register('Google Tag Manager');
  console.log('Google Tag Manager');
  useEffect(() => {
    setTimeout(() => {
      const isTrackingAllowed = canTrack();
      console.log('CustomAnalytics - isTrackingAllowed', isTrackingAllowed);
    }, 1000);
    // Standard events
    subscribe('page_viewed', (data) => {
      console.log('CustomAnalytics - Page viewed:', data);
      window.dataLayer.push({
        event: 'shopify_page_view',
        page: data.url,
      });
    });
    subscribe('product_viewed', (data) => {
      console.log('CustomAnalytics - Product viewed:', data);
      if (data.products && data.products.length > 0) {
        const product = data.products[0];
        window.dataLayer.push({
          event: 'view_item',
          ecommerce: {
            items: [
              {
                item_id: product.id,
                item_name: product.title,
                price: product.price,
                quantity: product.quantity,
                item_variant: product.variantTitle,
                item_brand: product.vendor,
                // Add more product details as needed
              },
            ],
          },
        });
      }
    });

    ready();
  }, []);

  return null;
}

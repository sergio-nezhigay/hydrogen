import {useAnalytics} from '@shopify/hydrogen';
import {useEffect} from 'react';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

function initializeDataLayer() {
  if (!window.dataLayer) {
    window.dataLayer = [];
  }
}

export function GoogleTagManager() {
  const {subscribe, register, canTrack} = useAnalytics();
  const {ready} = register('Google Tag Manager');

  useEffect(() => {
    setTimeout(() => {
      const isTrackingAllowed = canTrack();
      // eslint-disable-next-line no-console
      console.log('CustomAnalytics - isTrackingAllowed', isTrackingAllowed);
    }, 1000);

    subscribe('page_viewed', () => {
      // Triggering a custom event in GTM when a product is viewed
      window.dataLayer = window.dataLayer || [];
      // eslint-disable-next-line no-console
      console.log('CustomAnalytics2 - Page viewed:');

      window.dataLayer.push({
        event: 'shopify_page_view',
        //page: data.url,
      });
    });
    //subscribe('product_viewed', () => {
    //  // Triggering a custom event in GTM when a product is viewed
    //  window.dataLayer = window.dataLayer || [];
    //  window.dataLayer.push({event: 'viewed-product'});
    //});

    ready();
  }, [canTrack, ready, subscribe]);

  return null;
}

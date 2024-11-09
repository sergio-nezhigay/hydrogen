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
      const viewItemData = {
        event: 'view_item',
        url: data.url,
        ecommerce: {
          currency: 'UAH',
          value,
          items,
        },
      };
      console.log('viewItemData=', viewItemData);
      window.dataLayer.push(viewItemData);
    });
    subscribe('search_viewed', (data) => {
      console.log('from hydrogen search_submitted event data', data);
      const searchData = {
        event: 'search',
        url: data.url,
        ecommerce: {
          search_term: data?.searchTerm,
        },
      };
      console.log('🚀 ~ searchData:', searchData);
      window.dataLayer.push(searchData);
    });

    subscribe('collection_viewed', (data) => {
      console.log('from hydrogen code collection_viewed event', data);
      const collectionViewData = {
        event: 'view_item_list',
        url: data.url,
        ecommerce: {
          collection_id: data.collection?.id,
          collection_title: data?.collection?.handle,
        },
      };
      console.log('🚀 ~ collectionViewData:', collectionViewData);
      window.dataLayer.push(collectionViewData);
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

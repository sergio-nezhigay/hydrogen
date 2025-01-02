import {Script, useAnalytics, useNonce} from '@shopify/hydrogen';
import {useEffect} from 'react';

export function CustomAnalytics() {
  const {subscribe, canTrack} = useAnalytics();
  const nonce = useNonce();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const id = 'GTM-WRQRP5RF';
  if (!id) {
    return null;
  }

  return (
    <>
      {/* Initialize GTM container */}
      <Script
        nonce={nonce}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: `
              dataLayer = window.dataLayer || [];

              function gtag(){
                dataLayer.push(arguments)
              };

              gtag('js', new Date());
              gtag({'gtm.start': new Date().getTime(),event:'gtm.js'})
              gtag('config', "${id}");
          `,
        }}
      />

      {/* Load GTM script */}
      <Script async src={`https://www.googletagmanager.com/gtm.js?id=${id}`} />
    </>
  );
}

import {Script, useAnalytics} from '@shopify/hydrogen';
import {useEffect} from 'react';
import {useLoaderData} from '@remix-run/react';
import type {loader} from '~/root';

export function CustomAnalytics() {
  const {subscribe, canTrack} = useAnalytics();
  const data = useLoaderData<typeof loader>();
  useEffect(() => {
    setTimeout(() => {
      const isTrackingAllowed = canTrack();
      // eslint-disable-next-line no-console
      console.log('CustomAnalytics - isTrackingAllowed', isTrackingAllowed);
    }, 1000);
    // Standard events
    //subscribe('page_viewed', (data) => {
    //  // eslint-disable-next-line no-console
    //  console.log('CustomAnalytics - Page viewed:', data);
    //  initializeDataLayer();
    //  window.dataLayer.push({
    //    event: 'shopify_page_view',
    //    page: data.url,
    //  });
    //});
    //subscribe('product_viewed', (data) => {
    //  // eslint-disable-next-line no-console
    //  console.log('CustomAnalytics - Product viewed:', data);
    //  initializeDataLayer();
    //  if (data.products && data.products.length > 0) {
    //    const product = data.products[0];
    //    window.dataLayer.push({
    //      event: 'view_item',
    //      ecommerce: {
    //        items: [
    //          {
    //            item_id: product.id,
    //            item_name: product.title,
    //            price: product.price,
    //            quantity: product.quantity,
    //            item_variant: product.variantTitle,
    //            item_brand: product.vendor,
    //            // Add more product details as needed
    //          },
    //        ],
    //      },
    //    });
    //  }
    //});
    // subscribe('collection_viewed', (data) => {
    //   console.log('CustomAnalytics - Collection viewed:', data);
    // });
    // subscribe('cart_viewed', (data) => {
    //   console.log('CustomAnalytics - Cart viewed:', data);
    // });
    // subscribe('cart_updated', (data) => {
    //   console.log('CustomAnalytics - Cart updated:', data);
    // });
    // // Custom events
    // subscribe('custom_sidecart_viewed', (data) => {
    //   console.log('CustomAnalytics - Custom sidecart opened:', data);
    // });
  }, [canTrack, subscribe]);

  const initializeDataLayer = () => {
    if (!window.dataLayer) {
      window.dataLayer = [];
    }
  };
  const id = data?.googleGtmID;
  if (!id) {
    return null;
  }
  return (
    <>
      {/* Load GTM script */}
      <Script async src={`https://www.googletagmanager.com/gtm.js?id=${id}`} />
      {/* Initialize GTM container */}
      <Script
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: `
              dataLayer = window.dataLayer || [];
              function gtag(){
                dataLayer.push(arguments)
              };
              gtag('js', new Date());
              gtag('config', "${id}");
          `,
        }}
      />
    </>
  );
}

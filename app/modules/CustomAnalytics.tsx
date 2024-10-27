//import {Script, useAnalytics, useNonce} from '@shopify/hydrogen';
//import {useEffect} from 'react';

//export function CustomAnalytics() {
//  const {subscribe, canTrack} = useAnalytics();
//  const nonce = useNonce();

//  useEffect(() => {
//    setTimeout(() => {
//      let isTrackingAllowed = canTrack();
//      console.log('CustomAnalytics - isTrackingAllowed', isTrackingAllowed);
//    }, 1000);
//    // Standard events
//    subscribe('page_viewed', (data) => {
//      console.log('CustomAnalytics - Page viewed:', data);
//      window.dataLayer.push({
//        event: 'shopify_page_view',
//        page: data.url,
//      });
//    });

//    subscribe('product_viewed', (data) => {
//      console.log('CustomAnalytics - Product viewed:', data);
//      if (data.products && data.products.length > 0) {
//        const product = data.products[0];
//        window.dataLayer.push({
//          event: 'view_item',
//          ecommerce: {
//            items: [
//              {
//                item_id: product.id,
//                item_name: product.title,
//                price: product.price,
//                quantity: product.quantity,
//                item_variant: product.variantTitle,
//                item_brand: product.vendor,
//              },
//            ],
//          },
//        });
//      }
//    });
//    subscribe('collection_viewed', (data) => {
//      console.log('CustomAnalytics - Collection viewed:', data);
//      if (data.collection) {
//        window.dataLayer.push({
//          event: 'view_collection',
//          collection: {
//            collection_id: data.collection.id,
//            collection_handle: data.collection.handle,
//          },
//          shop: {
//            shop_id: data.shop?.shopId,
//            language: data.shop?.acceptedLanguage,
//            currency: data.shop?.currency,
//            subchannel_id: data.shop?.hydrogenSubchannelId,
//          },
//          url: data.url,
//        });
//      }
//    });
//    subscribe('cart_viewed', (data) => {
//      console.log('CustomAnalytics - Cart viewed:', data);
//    });
//    subscribe('cart_updated', (data) => {
//      console.log('CustomAnalytics - Cart updated:', data);
//    });

//    // Custom events
//    subscribe('custom_sidecart_viewed', (data) => {
//      console.log('CustomAnalytics - Custom sidecart opened:', data);
//    });
//    // eslint-disable-next-line react-hooks/exhaustive-deps
//  }, []);

//  let id = 'GTM-WRQRP5RF';
//  if (!id) {
//    return null;
//  }

//  return (
//    <>
//      {/* Initialize GTM container */}
//      <Script
//        nonce={nonce}
//        suppressHydrationWarning
//        dangerouslySetInnerHTML={{
//          __html: `
//              dataLayer = window.dataLayer || [];

//              function gtag(){
//                dataLayer.push(arguments)
//              };

//              gtag('js', new Date());
//              gtag({'gtm.start': new Date().getTime(),event:'gtm.js'})
//              gtag('config', "${id}");
//          `,
//        }}
//      />

//      {/* Load GTM script */}
//      <Script async src={`https://www.googletagmanager.com/gtm.js?id=${id}`} />
//    </>
//  );
//}

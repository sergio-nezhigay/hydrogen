//import {Suspense} from 'react';
//import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
//import {Await, useLoaderData} from '@remix-run/react';
//import {Image} from '@shopify/hydrogen';

//import {ReviewForm} from '~/modules/ReviewForm';

//export async function loader({request, context}: LoaderFunctionArgs) {
//  const productId = 'gid://shopify/Product/9708716785980';
//  const customerName = 'Serg77';
//  const customerEmail = 'abc@gmail.com';

//  if (!productId || !customerName || !customerEmail) {
//    throw new Response('Missing parameters', {status: 400});
//  }

//  const product = await context.storefront.query(GET_PRODUCT_QUERY, {
//    variables: {id: productId},
//  });

//  return defer({
//    product,
//    customerName,
//    customerEmail,
//  });
//}

//export default function ReviewPage() {
//  const {product, customerName, customerEmail} = useLoaderData<typeof loader>();

//  return (
//    <div className="max-w-2xl mx-auto p-6">
//      <Suspense fallback={<div>Loading review form...</div>}>
//        <Await resolve={product}>
//          {(resolvedProduct) => {
//            console.log('🚀 ~ resolvedProduct:', resolvedProduct);
//            if (!resolvedProduct || !resolvedProduct?.product?.id) return null;
//            // Get the first image from the product images array
//            //const firstImage = productData.images.edges[0]?.node;

//            return (
//              <>
//                <h1 className="text-2xl font-bold mb-4">
//                  Leave a Review for{' '}
//                  {resolvedProduct?.product?.title || 'Product'}
//                </h1>

//                <div className="w-[200px] mx-auto mb-4">
//                  <Image
//                    data={resolvedProduct?.product?.images.edges[0].node}
//                    sizes="300px"
//                    className=" object-cover "
//                    aspectRatio="4/5"
//                  />
//                </div>

//                <ReviewForm
//                  productId={resolvedProduct?.product?.id}
//                  name={customerName}
//                  email={customerEmail}
//                />
//              </>
//            );
//          }}
//        </Await>
//      </Suspense>
//    </div>
//  );
//}

//const GET_PRODUCT_QUERY = `#graphql
//  query GetProduct($id: ID!) {
//    product(id: $id) {
//      id
//      title
//      images(first: 1) {
//        edges {
//        node {
//          url
//          altText
//          height
//          width
//        }
//      }
//      }
//    }
//  }
//`;

//import {Image} from '@shopify/hydrogen';

//import type {GetProductQuery} from 'storefrontapi.generated';

//interface ProductDisplayProps {
//  product: GetProductQuery['product'];
//}

//export function ProductDisplay({product}: ProductDisplayProps) {
//  const image = product?.images.edges[0]?.node;

//  return (
//    <>
//      {image && (
//        <div className="w-20 mx-auto">
//          <Image
//            data={image}
//            sizes="auto"
//            className="object-cover rounded"
//            aspectRatio="1/1"
//          />
//        </div>
//      )}
//    </>
//  );
//}

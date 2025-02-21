import type {LoaderFunctionArgs, MetaArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData} from '@remix-run/react';
import type {Storefront} from '@shopify/hydrogen';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  getSeoMeta,
} from '@shopify/hydrogen';
import clsx from 'clsx';
import {Suspense, useEffect, useRef, useState} from 'react';
import invariant from 'tiny-invariant';

import {Heading, Section} from '~/components/Text';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductForm} from '~/components/ProductForm';
import DynamicGallery from '~/modules/DynamicGallery';
import {MEDIA_FRAGMENT, PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {ProductSwimlane} from '~/components/ProductSwimlane';
import {ReviewForm} from '~/modules/ReviewForm';
import {ReviewList} from '~/modules/ReviewList';
import {ShippingPaymentWarranty} from '~/modules/ShippingPaymentWarranty';
import {StarRating} from '~/modules/StarRating';
import {getJudgemeReviews} from '~/lib/judgeme';
import {useTranslation} from '~/lib/utils';
import {seoPayload} from '~/lib/seo.server';
import {ProductImage} from '~/components/ProductImage';
import {useJwtPayload} from '~/hooks/useJwtPayload';
import {useVisitedProducts} from '~/hooks/useVisitedProducts';

interface VisitedProduct {
  id: string;
  handle: string;
  title: string;
  imageUrl: string;
  price: string;
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export const handle = {
  breadcrumbType: 'product',
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({
  context,
  params,
  request,
}: LoaderFunctionArgs) {
  const judgeme_API_TOKEN = context.env.JUDGEME_PUBLIC_TOKEN;
  const shop_domain = context.env.PUBLIC_STORE_DOMAIN;
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}, judgemeReviewsData] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
    // Add other queries here, so that they are loaded in parallel
    getJudgemeReviews(judgeme_API_TOKEN, shop_domain, handle),
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  const recommended = getRecommendedProducts(context.storefront, product.id);
  const seo = product.selectedOrFirstAvailableVariant
    ? seoPayload.product({
        product: {
          ...product,
          variants: {
            nodes: [product.selectedOrFirstAvailableVariant],
          },
          seo: {
            title: product.seo?.title,
            description: product.seo?.description,
          },
        },
        selectedVariant: product.selectedOrFirstAvailableVariant,
        url: request.url,
        judgemeReviewsData,
      })
    : null;
  return {
    product,
    judgemeReviewsData,
    recommended,
    seo,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context, params}: LoaderFunctionArgs) {
  // Put any API calls that is not critical to be available on first page render
  // For example: product reviews, product recommendations, social feeds.

  return {};
}

export default function Product() {
  const {product, judgemeReviewsData, recommended} =
    useLoaderData<typeof loader>();
  const {translation} = useTranslation();
  const rating = judgemeReviewsData?.rating ?? 0;
  const reviewNumber = judgemeReviewsData?.reviewNumber ?? 0;
  const reviews = judgemeReviewsData?.reviews ?? [];
  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  const visitedProducts = useVisitedProducts({
    id: product.id,
    handle: product.handle,
    title: product.title,
    imageUrl: product.media.nodes[0]?.previewImage?.url || '',
    price: selectedVariant?.price.amount || '0',
  });

  useJwtPayload();

  // Sets the search param to the selected variant without navigation
  // only when no search params are set in the url
  //  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const handleScrollToReviews = (event: {preventDefault: () => void}) => {
    event.preventDefault();
    document
      .getElementById('review-list')
      ?.scrollIntoView({behavior: 'smooth'});
  };

  const {media, title, descriptionHtml, warranty, delta} = product;

  const warrantyTerm = warranty?.value || '12';
  const [sku1, sku2] = product.selectedOrFirstAvailableVariant?.sku?.split(
    '^',
  ) || [null, null];
  const barcode = product.selectedOrFirstAvailableVariant?.barcode;

  return (
    <>
      <Section
        heading="Опис товару"
        padding="y"
        headingClassName="sr-only"
        display="flex"
      >
        <div className="grid md:grid-cols-[5fr_5fr] xl:grid-cols-[4fr_6fr] md:gap-16">
          <DynamicGallery
            data={media.nodes}
            presentationComponent={ProductImage}
            itemStyle="my-gallery-item-style"
            showThumbs={true}
          />
          <div className="flex flex-col gap-8 md:gap-16 md:top-24 md:sticky ">
            <div className="grid gap-2 ">
              <Heading as="h1" className=" overflow-hidden whitespace-normal ">
                {title}
              </Heading>
              <div
                className={clsx({
                  'flex-between': reviewNumber > 0,
                  'flex-end': reviewNumber === 0,
                })}
              >
                {reviewNumber > 0 && (
                  <a
                    href="#review-list"
                    className="space-x-2 flex"
                    onClick={handleScrollToReviews}
                  >
                    <StarRating rating={rating} />
                    <span className="align-top">({reviewNumber})</span>
                  </a>
                )}

                {sku1 && (
                  <span className="text-primary/70">КOД:&nbsp;{sku1}--</span>
                )}
              </div>
            </div>
            <div className="md:flex-start gap-8">
              <div className="sm-max:mb-4">
                {selectedVariant.availableForSale && (
                  <p className="mb-1">{translation.available}</p>
                )}
                <ProductPrice
                  price={selectedVariant?.price}
                  compareAtPrice={selectedVariant?.compareAtPrice}
                />
              </div>

              <ProductForm
                productOptions={productOptions}
                selectedVariant={selectedVariant}
                delta={delta?.value || '0'}
              />
            </div>

            <ShippingPaymentWarranty warrantyTerm={warrantyTerm} />
            <div>
              <h2 className="font-semibold text-xl mb-4">
                {translation.description}
              </h2>
              <div
                className="description"
                dangerouslySetInnerHTML={{__html: descriptionHtml}}
              />
              <div className="text-sm flex gap-5 w/full mt-2  text-primary/20">
                {sku2 && (
                  <div className="border size-5 flex-center rounded-full">
                    {sku2.slice(0, 1)}
                  </div>
                )}
                {barcode && <p className="w/full flex">{barcode}</p>}
              </div>
            </div>
          </div>
        </div>
      </Section>
      <Suspense fallback={<div>Loading related products...</div>}>
        <LazyLoadComponent>
          <Await
            errorElement="There was a problem loading related products"
            resolve={recommended}
          >
            {(products) => (
              <ProductSwimlane
                title={translation.also_interested}
                products={products}
              />
            )}
          </Await>
        </LazyLoadComponent>
      </Suspense>

      <Suspense fallback={<div>Loading complementary products...</div>}>
        <LazyLoadComponent>
          <Await
            errorElement="There was a problem loading complementary products"
            resolve={recommended}
          >
            {(products) => (
              <>
                {products.complementaryNodes.length > 0 && (
                  <ProductSwimlane
                    title={translation.complementary_products}
                    products={{nodes: products.complementaryNodes}}
                  />
                )}
              </>
            )}
          </Await>
        </LazyLoadComponent>
      </Suspense>

      {visitedProducts.length > 0 && (
        <LazyLoadComponent>
          <ProductSwimlane
            title={translation.already_seen}
            products={{nodes: visitedProducts}}
          />
        </LazyLoadComponent>
      )}

      <ReviewList reviews={reviews} title={translation.reviews} />

      <ReviewForm productId={product.id} />

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </>
  );
}

function LazyLoadComponent({children}: {children: JSX.Element}) {
  const [isInView, setIsInView] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {threshold: 0.1},
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return <div ref={observerRef}>{isInView && children}</div>;
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    compareAtPrice {
      amount
      currencyCode
    }
    id
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    barcode
    title
    unitPrice {
      amount
      currencyCode
    }

  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
      }
    }
    media(first: 9) {
      nodes {
        ...Media
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
    collections(first: 1) {
      nodes {
        title
        handle
      }
    }
    delta: metafield(namespace: "custom", key: "delta") {
      value
    }
    warranty: metafield(namespace: "custom", key: "warranty") {
      value
    }
  }
  ${MEDIA_FRAGMENT}
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  query productRecommendations(
    $productId: ID!
    $count: Int
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    recommended: productRecommendations(productId: $productId) {
      ...ProductCard
    }
    complementary: productRecommendations(productId: $productId, intent: COMPLEMENTARY) {
      ...ProductCard
    }
    additional: products(first: $count, query: "available_for_sale:true",sortKey: BEST_SELLING) {
      nodes {
        ...ProductCard
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;

async function getRecommendedProducts(
  storefront: Storefront,
  productId: string,
) {
  const products = await storefront.query(RECOMMENDED_PRODUCTS_QUERY, {
    variables: {productId, count: 6},
  });

  invariant(products, 'No data returned from Shopify API');

  const mergedProducts = (products.recommended ?? [])
    .concat(products.additional.nodes)
    .filter(
      (value: {id: any}, index: any, array: any[]) =>
        array.findIndex((value2) => value2.id === value.id) === index,
    );

  const originalProduct = mergedProducts.findIndex(
    (item: {id: string}) => item.id === productId,
  );

  mergedProducts.splice(originalProduct, 1);

  return {
    nodes: mergedProducts,
    complementaryNodes: products.complementary ?? [],
  };
}

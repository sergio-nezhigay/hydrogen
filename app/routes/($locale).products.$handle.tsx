import {Suspense} from 'react';
import type {LoaderFunctionArgs, MetaArgs} from '@shopify/remix-oxygen';
import {defer, redirect} from '@shopify/remix-oxygen';
import {Await, useLoaderData, useRouteLoaderData} from '@remix-run/react';
import type {Storefront} from '@shopify/hydrogen';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getSeoMeta,
} from '@shopify/hydrogen';
import type {SelectedOption} from '@shopify/hydrogen/storefront-api-types';
import clsx from 'clsx';
import invariant from 'tiny-invariant';

import type {ProductFragment} from 'storefrontapi.generated';
import {MEDIA_FRAGMENT, PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {getVariantUrl} from '~/lib/variants';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductImage} from '~/components/ProductImage';
import {ProductForm} from '~/components/ProductForm';
import {Heading, Section} from '~/components/Text';
import {submitReviewAction, useTranslation} from '~/lib/utils';
import {getJudgemeReviews} from '~/lib/judgeme';
import {seoPayload} from '~/lib/seo.server';
import {StarRating} from '~/modules/StarRating';
import {ReviewForm} from '~/modules/ReviewForm';
import {ProductSwimlane} from '~/components/ProductSwimlane';
import {Skeleton} from '~/components/Skeleton';
import type {RootLoader} from '~/root';
import {ReviewList} from '~/modules/ReviewList';
import {ShippingPaymentWarranty} from '~/modules/ShippingPaymentWarranty';
import DynamicGallery from '~/modules/DynamicGallery';

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export const handle = {
  breadcrumbType: 'product',
};

export const action = async ({
  request,
  context,
  params,
}: LoaderFunctionArgs) => {
  return await submitReviewAction({request, context, params});
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
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
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }
  const judgeme_API_TOKEN = context.env.JUDGEME_PUBLIC_TOKEN;
  const shop_domain = context.env.PUBLIC_STORE_DOMAIN;

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

  const firstVariant = product.variants.nodes[0];
  const firstVariantIsDefault = Boolean(
    firstVariant.selectedOptions.find(
      (option: SelectedOption) =>
        option.name === 'Title' && option.value === 'Default Title',
    ),
  );

  if (firstVariantIsDefault) {
    product.selectedVariant = firstVariant;
  } else {
    // if no selected variant was returned from the selected options,
    // we redirect to the first variant's url with it's selected options applied
    if (!product.selectedVariant) {
      throw redirectToFirstVariant({product, request});
    }
  }
  const seo = seoPayload.product({
    product,
    selectedVariant: product.selectedVariant,
    url: request.url,
    judgemeReviewsData,
  });
  console.log(
    '===== LOG START =====',
    new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
  );
  console.log('product:', JSON.stringify(product, null, 4));

  return {
    product,
    recommended,
    seo,
    judgemeReviewsData,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context, params}: LoaderFunctionArgs) {
  // In order to show which variants are available in the UI, we need to query
  // all of them. But there might be a *lot*, so instead separate the variants
  // into it's own separate query that is deferred. So there's a brief moment
  // where variant options might show as available when they're not, but after
  // this deffered query resolves, the UI will update.
  const variants = context.storefront
    .query(VARIANTS_QUERY, {
      variables: {handle: params.handle!},
    })
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render

      console.error(error);
      return null;
    });

  return {
    variants,
  };
}

function redirectToFirstVariant({
  product,
  request,
}: {
  product: ProductFragment;
  request: Request;
}) {
  const url = new URL(request.url);
  const firstVariant = product.variants.nodes[0];

  return redirect(
    getVariantUrl({
      pathname: url.pathname,
      handle: product.handle,
      selectedOptions: firstVariant.selectedOptions,
      searchParams: new URLSearchParams(url.search),
    }),
    {
      status: 302,
    },
  );
}

export default function Product() {
  //  const rootData = useRouteLoaderData<RootLoader>('root');

  const {product, variants, judgemeReviewsData, recommended} =
    useLoaderData<typeof loader>();

  const {media, title, descriptionHtml} = product;

  const selectedVariant = useOptimisticVariant(
    product.selectedVariant,
    variants,
  );

  const {translation} = useTranslation();
  const rating = judgemeReviewsData?.rating ?? 0;
  const reviewNumber = judgemeReviewsData?.reviewNumber ?? 0;
  const reviews = judgemeReviewsData?.reviews ?? [];
  const handleScrollToReviews = (event: {preventDefault: () => void}) => {
    event.preventDefault();
    document
      .getElementById('review-list')
      ?.scrollIntoView({behavior: 'smooth'});
  };

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

                {product.selectedVariant?.sku && (
                  <span className="text-primary/70">
                    КOД:&nbsp;{product.selectedVariant.sku.split('^')[0]}
                  </span>
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

              <Suspense
                fallback={
                  <ProductForm
                    product={product}
                    selectedVariant={selectedVariant}
                    variants={[]}
                  />
                }
              >
                <Await
                  errorElement="There was a problem loading product variants"
                  resolve={variants}
                >
                  {(data) => (
                    <ProductForm
                      product={product}
                      selectedVariant={selectedVariant}
                      variants={data?.product?.variants.nodes || []}
                    />
                  )}
                </Await>
              </Suspense>
            </div>

            <ShippingPaymentWarranty />
            <div>
              <h2 className="font-semibold text-xl mb-4">
                {translation.description}
              </h2>
              <div
                className="description"
                dangerouslySetInnerHTML={{__html: descriptionHtml}}
              />
            </div>
          </div>
        </div>
      </Section>
      <Suspense fallback={<Skeleton className="h-32" />}>
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
      </Suspense>
      <Suspense fallback={<Skeleton className="h-8" />}>
        <Await
          errorElement="There was a problem loading related products"
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
      </Suspense>

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

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
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
    title
    unitPrice {
      amount
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
    options {
      name
      values
    }
    media(first: 7) {
      nodes {
        ...Media
      }
    }

    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    variants(first: 1) {
      nodes {
        ...ProductVariant
      }

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

const PRODUCT_VARIANTS_FRAGMENT = `#graphql
  fragment ProductVariants on Product {
    variants(first: 250) {
      nodes {
        ...ProductVariant

      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}

` as const;

const VARIANTS_QUERY = `#graphql
  ${PRODUCT_VARIANTS_FRAGMENT}
  query ProductVariants(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ProductVariants
    }
  }
` as const;

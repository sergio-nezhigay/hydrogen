import {Suspense} from 'react';
import {defer, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, Link, useLoaderData, type MetaFunction} from '@remix-run/react';
import type {ProductFragment} from 'storefrontapi.generated';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
} from '@shopify/hydrogen';
import type {SelectedOption} from '@shopify/hydrogen/storefront-api-types';
import {getVariantUrl} from '~/lib/variants';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductImage} from '~/components/ProductImage';
import {ProductForm} from '~/components/ProductForm';
import {Heading, Section, Text} from '~/components/Text';
import {getExcerpt, useTranslation} from '~/lib/utils';
import {getJudgemeReviews} from '~/lib/judgeme';
import {seoPayload} from '~/lib/seo.server';
import clsx from 'clsx';
import {StarRating} from '~/modules/StarRating';
import {ReviewForm} from '~/modules/ReviewForm';
import ReviewList from '~/modules/ReviewList';
import {Disclosure, DisclosurePanel} from '@headlessui/react';
import {IconClose} from '~/components/Icon';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Hydrogen | ${data?.product.title ?? ''}`}];
};

export const handle = {
  breadcrumbType: 'product',
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

  const [{product, shop}, judgemeReviewsData] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
    // Add other queries here, so that they are loaded in parallel
    getJudgemeReviews(judgeme_API_TOKEN, shop_domain, handle),
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

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

  return {
    product,
    shop,
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
  const {product, shop, variants, judgemeReviewsData} =
    useLoaderData<typeof loader>();
  const {shippingPolicy, refundPolicy} = shop;

  const selectedVariant = useOptimisticVariant(
    product.selectedVariant,
    variants,
  );
  const {title, descriptionHtml} = product;
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
    <div className=" container">
      <div className="product">
        <ProductImage image={selectedVariant?.image} />
        <div className="product-main">
          <div className="grid gap-2 ">
            <Heading as="h1" className="overflow-hidden whitespace-normal ">
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
                  Код:&nbsp;{product.selectedVariant?.sku}
                </span>
              )}
            </div>
          </div>
          <div className="md:flex-start gap-8">
            <div className="sm-max:mb-4">
              <p className="mb-1">{translation.available}</p>
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
          <div className="grid gap-4 py-4">
            {descriptionHtml && (
              <ProductDetail
                title={translation.description}
                content={descriptionHtml}
                isOpen={true}
              />
            )}
            {shippingPolicy?.body && (
              <ProductDetail
                title={translation.shipping}
                content={getExcerpt(shippingPolicy.body)}
                learnMore={`/policies/${shippingPolicy.handle}`}
              />
            )}
            {refundPolicy?.body && (
              <ProductDetail
                title={translation.returns}
                content={getExcerpt(refundPolicy.body)}
                learnMore={`/policies/${refundPolicy.handle}`}
              />
            )}
          </div>
        </div>
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
      </div>

      <div id="review-list">
        <ReviewList reviews={reviews} title={translation.reviews} />
        <ReviewForm productId={product.id} locale={'ru'} />
      </div>
    </div>
  );
}

function ProductDetail({
  title,
  content,
  learnMore,
  isOpen = false,
}: {
  title: string;
  content: string;
  learnMore?: string;
  isOpen?: boolean;
}) {
  const {translation} = useTranslation();

  return (
    <Disclosure
      key={title}
      defaultOpen={isOpen}
      as="div"
      className="grid w-full gap-2"
    >
      {({open}) => (
        <>
          <Disclosure.Button className="text-left flex justify-between items-center">
            <Text size="lead" className="inline-block">
              {title}
            </Text>
            <IconClose
              className={clsx(
                'transform-gpu transition-transform duration-200',
                !open && 'rotate-45',
              )}
            />
          </Disclosure.Button>

          <DisclosurePanel
            transition
            className={
              'grid gap-2 pb-4 pt-2 origin-top transition duration-200 ease-out data-[closed]:-translate-y-8 data-[closed]:opacity-0'
            }
          >
            <div
              //  className="prose dark:prose-invert"
              dangerouslySetInnerHTML={{__html: content}}
            />
            {learnMore && (
              <div className="">
                <Link
                  className="border-b border-primary/30 pb-px text-primary/50"
                  to={learnMore}
                >
                  {translation.learn_more}
                </Link>
              </div>
            )}
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
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
    options {
      name
      values
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
    supplier: metafield(namespace: "custom", key: "supplier") {
      value
    }
  }
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
    shop {
      name
      primaryDomain {
        url
      }
      shippingPolicy {
        body
        handle
      }
      refundPolicy {
        body
        handle
      }
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

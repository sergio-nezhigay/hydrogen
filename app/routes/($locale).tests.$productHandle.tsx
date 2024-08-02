import {useRef, Suspense} from 'react';
import {Image} from '@shopify/hydrogen';
import {Disclosure, Listbox} from '@headlessui/react';
import {ShoppingCart} from 'lucide-react';
import {
  defer,
  type MetaArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {useLoaderData, Await, useNavigate, useMatches} from '@remix-run/react';
import {
  getSeoMeta,
  VariantSelector,
  getSelectedProductOptions,
  Analytics,
} from '@shopify/hydrogen';
import invariant from 'tiny-invariant';
import clsx from 'clsx';

import type {
  MediaFragment,
  ProductQuery,
  ProductVariantFragmentFragment,
} from 'storefrontapi.generated';
import {Heading, Section, Text} from '~/components/Text';
import {Link} from '~/components/Link';
import {Button} from '~/components/Button';
import {AddToCartButton} from '~/components/AddToCartButton';
import {Skeleton} from '~/components/Skeleton';
import {ProductSwimlane} from '~/components/ProductSwimlane';
import {IconCaret, IconCheck, IconClose} from '~/components/Icon';
import {getExcerpt, useTranslation} from '~/lib/utils';
import {seoPayload} from '~/lib/seo.server';
import type {Storefront} from '~/lib/type';
import {routeHeaders} from '~/data/cache';
import {MEDIA_FRAGMENT, PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import HryvniaMoney from '~/components/HryvniaMoney';
import {translations} from '~/data/translations';
import {addJudgemeReview, getJudgemeReviews} from '~/lib/judgeme';
import {StarRating} from '~/modules/StarRating';
import {ReviewForm} from '~/modules/ReviewForm';
import ReviewList from '~/modules/ReviewList';
import {Gallery} from '~/modules/Gallery';

export const headers = routeHeaders;

export const handle = {
  breadcrumbType: 'product',
};

export async function loader(args: LoaderFunctionArgs) {
  console.log('====================================');
  console.log();
  console.log('====================================');
  const {productHandle} = args.params;
  invariant(productHandle, 'Missing productHandle param, check route filename');

  // Start fetching non-critical data without blocking time to first byte
  //  const deferredData = loadDeferredData(args);

  //  // Await the critical data required to render initial state of the page
  //  const criticalData = await loadCriticalData(args);

  return defer({
    //...deferredData,
    //...criticalData,
  });
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */

//export const meta = ({matches}: MetaArgs<typeof loader>) => {
//  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
//};

export default function Product() {
  return (
    <>
      <h1>product test</h1>
    </>
  );
}

export type ProductImageProps = {
  itemData: MediaFragment;
  index: number;
};

function ProductImage({itemData, index}: ProductImageProps) {
  const image =
    itemData.__typename === 'MediaImage'
      ? {...itemData.image, altText: itemData.alt || 'Product image ' + index}
      : null;
  return (
    <>
      {image && (
        <Image
          loading={index === 0 ? 'eager' : 'lazy'}
          data={image}
          aspectRatio={'1/1'}
          sizes="auto"
          className="object-cover w-full h-full"
        />
      )}
    </>
  );
}

export function ProductForm({
  variants,
}: {
  variants: ProductVariantFragmentFragment[];
}) {
  const {product, storeDomain, locale} = useLoaderData<typeof loader>();
  const translation = useTranslation();
  const closeRef = useRef<HTMLButtonElement>(null);

  /**
   * Likewise, we're defaulting to the first variant for purposes
   * of add to cart if there is none returned from the loader.
   * A developer can opt out of this, too.
   */
  const selectedVariant = product.selectedVariant!;
  const isOutOfStock = !selectedVariant?.availableForSale;
  const isOnSale =
    selectedVariant?.price?.amount &&
    selectedVariant?.compareAtPrice?.amount &&
    selectedVariant?.price?.amount < selectedVariant?.compareAtPrice?.amount;

  const navigate = useNavigate();

  return (
    <>
      <VariantSelector
        handle={product.handle}
        options={product.options}
        variants={variants}
      >
        {({option}) => {
          const valuesNumber = option.values.length;
          return valuesNumber > 1 ? (
            <div
              key={option.name}
              className="mb-4 flex flex-col flex-wrap gap-y-2 last:mb-0"
            >
              <Heading as="legend" size="lead" className="min-w-16">
                {option.name}
              </Heading>

              <div className="flex flex-wrap items-baseline gap-4">
                {valuesNumber > 7 ? (
                  <div className="relative w-full">
                    <Listbox
                      onChange={(selectedOption) => {
                        const value = option.values.find(
                          (v) => v.value === selectedOption,
                        );

                        if (value) {
                          navigate(value.to);
                        }
                      }}
                    >
                      {({open}) => (
                        <>
                          <Listbox.Button
                            ref={closeRef}
                            className={clsx(
                              'flex w-full items-center justify-between border border-primary px-4 py-3',
                              open
                                ? 'rounded-b md:rounded-b-none md:rounded-t'
                                : 'rounded',
                            )}
                          >
                            <span>{option.value}</span>

                            <IconCaret direction={open ? 'up' : 'down'} />
                          </Listbox.Button>
                          <Listbox.Options
                            className={clsx(
                              'absolute bottom-12 z-30 grid h-48 w-full overflow-y-scroll rounded-t border border-primary bg-contrast p-2 transition-[max-height] duration-150 sm:bottom-auto md:rounded-b md:rounded-t-none md:border-b md:border-t-0',
                              open ? 'max-h-48' : 'max-h-0',
                            )}
                          >
                            {option.values
                              .filter((value) => value.isAvailable)
                              .map(({value, to, isActive}) => (
                                <Listbox.Option
                                  key={`option-${option.name}-${value}`}
                                  value={value}
                                >
                                  {({active}) => (
                                    <Link
                                      to={to}
                                      preventScrollReset
                                      className={clsx(
                                        'flex w-full cursor-pointer items-center justify-start rounded p-2 text-left text-primary transition',
                                        active && 'bg-primary/10',
                                      )}
                                      onClick={() => {
                                        if (!closeRef?.current) return;
                                        closeRef.current.click();
                                      }}
                                    >
                                      {value}
                                      {isActive && (
                                        <span className="ml-2">
                                          <IconCheck />
                                        </span>
                                      )}
                                    </Link>
                                  )}
                                </Listbox.Option>
                              ))}
                          </Listbox.Options>
                        </>
                      )}
                    </Listbox>
                  </div>
                ) : (
                  option.values.map(({value, isAvailable, isActive, to}) => (
                    <Link
                      key={option.name + value}
                      to={to}
                      preventScrollReset
                      prefetch="intent"
                      replace
                      className={clsx(
                        'cursor-pointer border-b-[1.5px] py-1 leading-none transition-all duration-200',
                        isActive ? 'border-primary/50' : 'border-primary/0',
                        isAvailable ? 'opacity-100' : 'opacity-50',
                      )}
                    >
                      {value}
                    </Link>
                  ))
                )}
              </div>
            </div>
          ) : (
            <></>
          );
        }}
      </VariantSelector>
      {selectedVariant && (
        <>
          {isOutOfStock ? (
            <Button variant="secondary" disabled>
              <Text>{translation.sold_out}</Text>
            </Button>
          ) : (
            <div className="md:flex-start gap-4">
              <div className="sm-max:mb-4">
                <p className="mb-1">{translation.available}</p>
                <HryvniaMoney
                  data={selectedVariant.price!}
                  className="text-xl md:text-3xl"
                />
                {isOnSale && (
                  <HryvniaMoney
                    data={selectedVariant?.compareAtPrice!}
                    className="strike opacity-50 inline"
                  />
                )}
              </div>

              <AddToCartButton
                lines={[
                  {
                    merchandiseId: selectedVariant.id!,
                    quantity: 1,
                  },
                ]}
                variant="red"
                data-test="add-to-cart"
                className="sm-max:w-full"
              >
                <ShoppingCart className="mr-4 size-6" />
                <Text
                  as="span"
                  className="flex items-center justify-center gap-2"
                >
                  <span>{translation.buy}</span>
                </Text>
              </AddToCartButton>
            </div>
          )}
        </>
      )}
    </>
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
  const translation = useTranslation();

  return (
    <Disclosure
      key={title}
      defaultOpen={isOpen}
      as="div"
      className="grid w-full gap-2"
    >
      {({open}) => (
        <>
          <Disclosure.Button className="text-left">
            <div className="flex justify-between">
              <Text size="lead" as="h4">
                {title}
              </Text>
              <IconClose
                className={clsx(
                  'transform-gpu transition-transform duration-200',
                  !open && 'rotate-45',
                )}
              />
            </div>
          </Disclosure.Button>

          <Disclosure.Panel className={'grid gap-2 pb-4 pt-2'}>
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
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariantFragment on ProductVariant {
    id
    availableForSale
    selectedOptions {
      name
      value
    }
    image {
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
    compareAtPrice {
      amount
      currencyCode
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
  }
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
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
        ...ProductVariantFragment
      }
      media(first: 7) {
        nodes {
          ...Media
        }
      }
      variants(first: 1) {
        nodes {
          ...ProductVariantFragment
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
  ${MEDIA_FRAGMENT}
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const VARIANTS_QUERY = `#graphql
  query variants(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      variants(first: 250) {
        nodes {
          ...ProductVariantFragment
        }
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
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
    additional: products(first: $count, sortKey: BEST_SELLING) {
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
      (value, index, array) =>
        array.findIndex((value2) => value2.id === value.id) === index,
    );

  const originalProduct = mergedProducts.findIndex(
    (item) => item.id === productId,
  );

  mergedProducts.splice(originalProduct, 1);

  return {nodes: mergedProducts};
}

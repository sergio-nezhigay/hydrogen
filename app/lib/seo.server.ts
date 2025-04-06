import {type SeoConfig} from '@shopify/hydrogen';
import type {
  Article,
  Blog,
  Collection,
  Page,
  Product,
  ShopPolicy,
  Image,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';
import type {
  Article as SeoArticle,
  BreadcrumbList,
  Blog as SeoBlog,
  CollectionPage,
  Offer,
  Review,
  Organization,
  Product as SeoProduct,
  WebPage,
  Person,
  Rating,
} from 'schema-dts';

import type {ShopFragment} from 'storefrontapi.generated';

import type {JudgemeReviewsData} from './type';
import {getAlternates} from './utils';

const domain = 'informatica.com.ua';

function root({
  shop,
  url,
}: {
  shop: ShopFragment;
  url: Request['url'];
}): SeoConfig {
  const canonicalUrl = getCanonicalUrl(url);

  return {
    title: shop?.name,
    titleTemplate: `%s`,
    description: truncate(shop?.description ?? ''),
    handle: '@shopify',
    url: canonicalUrl,
    robots: {
      noIndex: false,
      noFollow: false,
    },
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: shop.name,
      logo: shop.brand?.logo?.image?.url,
      url: canonicalUrl,
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+380993815288',
        contactType: 'Customer Service',
        availableLanguage: 'Ukrainian',
      },
      email: 'info@informatica.com.ua',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'вул. Щусєва, 36',
        addressLocality: 'Київ',
        addressCountry: 'UA',
      },
      location: {
        '@type': 'Place',
        name: shop.name,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'вул. Щусєва, 36',
          addressLocality: 'Київ',
          addressCountry: 'UA',
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: 'https://schema.org/Monday',
            opens: '10:00',
            closes: '18:00',
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: 'https://schema.org/Tuesday',
            opens: '10:00',
            closes: '18:00',
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: 'https://schema.org/Wednesday',
            opens: '10:00',
            closes: '18:00',
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: 'https://schema.org/Thursday',
            opens: '10:00',
            closes: '18:00',
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: 'https://schema.org/Friday',
            opens: '10:00',
            closes: '18:00',
          },
        ],
      },
    },
  };
}

function home({url}: {url: Request['url']}): SeoConfig {
  const alternates = getAlternates(url);
  return {
    title: 'Informatica',
    titleTemplate: `Магазин електроніки %s | ${domain}`,

    robots: {
      noIndex: false,
      noFollow: false,
    },
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Головна сторінка',
    },
    alternates,
    url,
  };
}

type SelectedVariantRequiredFields = Pick<ProductVariant, 'sku'> & {
  image?: null | Partial<Image>;
};

type ProductRequiredFields = Pick<
  Product,
  'title' | 'description' | 'vendor' | 'seo'
> & {
  variants: {
    nodes: Array<
      Pick<
        ProductVariant,
        'id' | 'sku' | 'price' | 'selectedOptions' | 'availableForSale'
      >
    >;
  };
};

function productJsonLd({
  product,
  selectedVariant,
  url,
  judgemeReviewsData,
}: {
  product: ProductRequiredFields;
  selectedVariant: SelectedVariantRequiredFields;
  url: Request['url'];
  judgemeReviewsData: JudgemeReviewsData;
}): SeoConfig['jsonLd'] {
  const origin = new URL(url).origin;
  const variants = product.variants.nodes;
  const description = truncate(
    product?.seo?.description ?? product?.description,
  );
  const offers: Offer[] = (variants || []).map((variant) => {
    const variantUrl = new URL(url);
    try {
      if (variant.id && typeof variant.id === 'string') {
        const variantId = variant.id.substring(variant.id.lastIndexOf('/') + 1);
        if (variantId) {
          variantUrl.searchParams.set('variant', variantId);
        } else {
          console.warn(`Could not extract variant ID from: ${variant.id}`);
        }
      } else {
        console.warn(
          `Variant ID is missing or not a string for SKU: ${variant.sku}`,
        );
      }
    } catch (e) {
      console.error(`Error processing variant ID for SKU ${variant.sku}:`, e);
    }
    //for (const option of variant.selectedOptions) {
    //  variantUrl.searchParams.set(option.name, option.value);
    //}
    const availability = variant.availableForSale
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock';

    return {
      '@type': 'Offer',
      availability,
      price: parseFloat(variant.price.amount),
      priceCurrency: variant.price.currencyCode,
      priceValidUntil: '2027-12-31',
      sku: variant?.sku ?? '',
      url: variantUrl.toString(),
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        url: `${origin}/policies/refund-policy`,
        applicableCountry: {
          '@type': 'Country',
          name: 'Ukraine',
        },
        returnPolicyCategory:
          'https://schema.org/MerchantReturnFiniteReturnWindow',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: 50.0,
          currency: 'UAH',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          businessDays: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [
              'https://schema.org/Monday',
              'https://schema.org/Tuesday',
              'https://schema.org/Wednesday',
              'https://schema.org/Thursday',
              'https://schema.org/Friday',
            ],
          },

          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 1,
            unitCode: 'd',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 2,
            unitCode: 'd',
          },
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'UA',
        },
        transitTimeLabel: 'Standard Shipping',
      },
    };
  }) as any;

  const reviews: Review[] = judgemeReviewsData.reviews.map((review) => ({
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: review.reviewer.name,
    } as Person,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating,
      bestRating: '5',
    } as Rating,
    reviewBody: review.body,
  }));

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Products',
          item: `${origin}/products`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: product.title,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      brand: {
        '@type': 'Brand',
        name: product.vendor,
      },
      description,
      image: [selectedVariant?.image?.url ?? ''],
      name: product.title,
      offers,
      sku: selectedVariant?.sku ?? '',
      url,
      aggregateRating:
        judgemeReviewsData.reviewNumber > 0
          ? {
              '@type': 'AggregateRating',
              ratingValue: judgemeReviewsData.rating,
              reviewCount: judgemeReviewsData.reviewNumber,
            }
          : undefined,
      review: reviews.length > 0 ? reviews : undefined,
    },
  ];
}

function product({
  product,
  url,
  selectedVariant,
  judgemeReviewsData,
}: {
  product: ProductRequiredFields;
  selectedVariant: SelectedVariantRequiredFields;
  url: Request['url'];
  judgemeReviewsData: JudgemeReviewsData;
}): SeoConfig {
  const seoTitle = product.seo.title;
  const seoDescription = product.seo.description;
  const productTitle = product?.seo?.title ?? product?.title;
  const canonicalUrl = getCanonicalUrl(url);
  const isRussian = url.includes('/ru');

  const pageTitle = isRussian
    ? `${productTitle} – купить`
    : `${productTitle} – купити`;

  const pageDescription = isRussian
    ? `Купить ${productTitle} | Низкие цены, гарантия, доставка по Украине`
    : `Купити ${productTitle} | Низькі ціни, гарантія, доставка по Україні`;

  return {
    title: seoTitle ? seoTitle : truncate(pageTitle, 120),
    description: seoDescription ? seoDescription : truncate(pageDescription),
    media: selectedVariant?.image,
    jsonLd: productJsonLd({
      product,
      selectedVariant,
      url: canonicalUrl,
      judgemeReviewsData,
    }),
    url: canonicalUrl,
  };
}

type CollectionRequiredFields = Omit<
  Collection,
  'products' | 'descriptionHtml' | 'metafields' | 'image' | 'updatedAt'
> & {
  products: {nodes: Pick<Product, 'handle'>[]};
  image?: null | Pick<Image, 'url' | 'height' | 'width' | 'altText'>;
  descriptionHtml?: null | Collection['descriptionHtml'];
  updatedAt?: null | Collection['updatedAt'];
  metafields?: null | Collection['metafields'];
};

function collectionJsonLd({
  url,
  collection,
}: {
  url: Request['url'];
  collection: CollectionRequiredFields;
}): SeoConfig['jsonLd'] {
  const origin = new URL(url).origin;
  const itemListElement: CollectionPage['mainEntity'] =
    collection.products.nodes.map((product, index) => {
      return {
        '@type': 'ListItem',
        position: index + 1,
        url: `/products/${product.handle}`,
      };
    });

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Колекції',
          item: `${origin}/collections`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: collection.title,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: collection?.seo?.title ?? collection?.title ?? '',
      description: truncate(
        collection?.seo?.description ?? collection?.description ?? '',
      ),
      image: collection?.image?.url,
      url: `/collections/${collection.handle}`,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement,
      },
    },
  ];
}

function collection({
  collection,
  url,
}: {
  collection: CollectionRequiredFields;
  url: Request['url'];
}): SeoConfig {
  const canonicalUrl = getCanonicalUrl(url);
  const alternates = getAlternates(canonicalUrl);
  return {
    title: collection?.seo?.title ?? collection?.title ?? '',
    description: truncate(
      collection?.seo?.description ?? collection?.description ?? '',
    ),
    titleTemplate: '%s',
    media: {
      type: 'image',
      url: collection?.image?.url,
      height: collection?.image?.height,
      width: collection?.image?.width,
      altText: collection?.image?.altText,
    },
    jsonLd: collectionJsonLd({collection, url: canonicalUrl}),
    alternates,
    url: canonicalUrl,
  };
}

function allProducts({
  collection,
  url,
}: {
  collection: CollectionRequiredFields;
  url: Request['url'];
}): SeoConfig {
  return {
    title: collection?.seo?.title,
    description: truncate(
      collection?.seo?.description ?? collection?.description ?? '',
    ),
    titleTemplate: '%s',
    media: {
      type: 'image',
      url: collection?.image?.url,
      height: collection?.image?.height,
      width: collection?.image?.width,
      altText: collection?.image?.altText,
    },
    robots: {
      noIndex: true,
      noFollow: true,
    },
    jsonLd: collectionJsonLd({collection, url}),
  };
}

function searchResults({
  collection,
  url,
}: {
  collection: CollectionRequiredFields;
  url: Request['url'];
}): SeoConfig {
  return {
    title: collection?.seo?.title,
    description: truncate(
      collection?.seo?.description ?? collection?.description ?? '',
    ),
    robots: {
      noIndex: true,
      noFollow: true,
    },
    titleTemplate: '%s',
    media: {
      type: 'image',
      url: collection?.image?.url,
      height: collection?.image?.height,
      width: collection?.image?.width,
      altText: collection?.image?.altText,
    },
    jsonLd: collectionJsonLd({collection, url}),
  };
}

type CollectionListRequiredFields = {
  nodes: Omit<CollectionRequiredFields, 'products'>[];
};

function collectionsJsonLd({
  url,
  collections,
}: {
  url: Request['url'];
  collections: CollectionListRequiredFields;
}): SeoConfig['jsonLd'] {
  const itemListElement: CollectionPage['mainEntity'] = collections.nodes.map(
    (collection, index) => {
      return {
        '@type': 'ListItem',
        position: index + 1,
        url: `/collections/${collection.handle}`,
      };
    },
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Колекції',
    description: 'Всі колекції',
    url,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement,
    },
  };
}

function listCollections({
  collections,
  url,
}: {
  collections: CollectionListRequiredFields;
  url: Request['url'];
}): SeoConfig {
  return {
    title: 'Колекції',
    titleTemplate: '%s | Колекції',
    description: 'Усі колекції',
    url,
    jsonLd: collectionsJsonLd({collections, url}),
  };
}

function article({
  article,
  url,
}: {
  article: Pick<
    Article,
    'title' | 'contentHtml' | 'seo' | 'publishedAt' | 'excerpt'
  > & {
    image?: null | Pick<
      NonNullable<Article['image']>,
      'url' | 'height' | 'width' | 'altText'
    >;
  };
  url: Request['url'];
}): SeoConfig {
  return {
    title: article?.seo?.title ?? article?.title,
    description: truncate(article?.seo?.description ?? ''),
    titleTemplate: '%s | Journal',
    url,
    media: {
      type: 'image',
      url: article?.image?.url,
      height: article?.image?.height,
      width: article?.image?.width,
      altText: article?.image?.altText,
    },
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      alternativeHeadline: article.title,
      articleBody: article.contentHtml,
      datePublished: article?.publishedAt,
      description: truncate(
        article?.seo?.description || article?.excerpt || '',
      ),
      headline: article?.seo?.title || '',
      image: article?.image?.url,
      url,
    },
  };
}

function blog({
  blog,
  url,
}: {
  blog: Pick<Blog, 'seo' | 'title'>;
  url: Request['url'];
}): SeoConfig {
  return {
    title: blog?.seo?.title,
    description: blog?.seo?.description || '',
    titleTemplate: '%s | Blog',
    url,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: blog?.seo?.title || blog?.title || '',
      description: blog?.seo?.description || '',
      url,
    },
  };
}

function page({
  page,
  url,
}: {
  page: Pick<Page, 'title' | 'seo'>;
  url: Request['url'];
}): SeoConfig {
  return {
    description: truncate(page?.seo?.description || ''),
    title: page?.seo?.title ?? page?.title,
    titleTemplate: '%s',
    url,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: page.title,
    },
  };
}

function policy({
  policy,
  url,
}: {
  policy: Pick<ShopPolicy, 'title' | 'body'>;
  url: Request['url'];
}): SeoConfig {
  return {
    description: truncate(policy?.body ?? ''),
    title: policy?.title,
    titleTemplate: '%s | Policy',
    url,
  };
}
function noindex({
  title,
  description,
  url,
}: {
  title: string;
  description: string;
  url: Request['url'];
}): SeoConfig {
  return {
    description: title,
    title,
    url,
    robots: {
      noIndex: true,
      noFollow: true,
    },
  };
}

function policies({
  policies,
  url,
}: {
  policies: Array<Pick<ShopPolicy, 'title' | 'handle'>>;
  url: Request['url'];
}): SeoConfig {
  const origin = new URL(url).origin;
  const itemListElement: BreadcrumbList['itemListElement'] = policies
    .filter(Boolean)
    .map((policy, index) => {
      return {
        '@type': 'ListItem',
        position: index + 1,
        name: policy.title,
        item: new URL(`/policies/${policy.handle}`, origin).toString(),
        //item: `${origin}/policies/${policy.handle}`,
      };
    });
  return {
    title: 'Policies',
    titleTemplate: '%s | Policies',
    description: 'Hydroge store policies',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        description: 'Hydrogen store policies',
        name: 'Policies',
        url,
      },
    ],
  };
}

function brand({
  brandHandle,
  url,
}: {
  brandHandle: string;
  url: Request['url'];
}): SeoConfig {
  const isRussian = url.includes('/ru');
  const canonicalUrl = getCanonicalUrl(url);
  const alternates = getAlternates(canonicalUrl);

  const capitalizedBrand =
    brandHandle.charAt(0).toUpperCase() + brandHandle.slice(1);

  const title = isRussian
    ? `${capitalizedBrand} - каталог товаров`
    : `${capitalizedBrand} - каталог товарів`;

  const description = isRussian
    ? `Официальный каталог товаров ${capitalizedBrand}. Лучшие цены, гарантия, доставка по Украине.`
    : `Офіційний каталог товарів ${capitalizedBrand}. Найкращі ціни, гарантія, доставка по Україні.`;

  return {
    title,
    description,
    titleTemplate: `%s | Informatica.com.ua`,
    url: canonicalUrl,
    alternates,
    robots: {
      noIndex: false,
      noFollow: false,
    },
  };
}

export const seoPayload = {
  article,
  blog,
  collection,
  home,
  listCollections,
  page,
  policies,
  policy,
  product,
  root,
  searchResults,
  allProducts,
  noindex,
  brand,
};

/**
 * Truncate a string to a given length, adding an ellipsis if it was truncated
 * @param str - The string to truncate
 * @param num - The maximum length of the string
 * @returns The truncated string
 * @example
 * ```js
 * truncate('Hello world', 5) // 'Hello...'
 * ```
 */
function truncate(str: string, num = 155): string {
  if (typeof str !== 'string') return '';
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num - 3) + '...';
}

function getCanonicalUrl(requestUrl: string): string {
  const url = new URL(requestUrl);
  return `${url.origin}${url.pathname}`;
}

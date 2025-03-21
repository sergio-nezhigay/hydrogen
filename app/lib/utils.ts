import {useRouteLoaderData} from '@remix-run/react';
import type {
  Filter,
  MoneyV2,
  ShopPolicy,
} from '@shopify/hydrogen/storefront-api-types';
import type {FulfillmentStatus} from '@shopify/hydrogen/customer-account-api-types';
import typographicBase from 'typographic-base';
import type {ClassValue} from 'clsx';
import clsx from 'clsx';
import {twMerge} from 'tailwind-merge';
import type {LoaderFunctionArgs, MetaArgs} from '@shopify/remix-oxygen';
import type {Storefront} from '@shopify/hydrogen';
import {getPaginationVariables} from '@shopify/hydrogen';

import type {
  AllProductsQuery,
  ChildMenuItemFragment,
  MenuFragment,
  ParentMenuItemFragment,
} from 'storefrontapi.generated';
import type {RootLoader} from '~/root';
import {countries} from '~/data/countries';
import {translations} from '~/data/translations';
import {ALL_PRODUCTS_QUERY} from '~/routes/($locale).products._index';

import {addJudgemeReview} from './judgeme';
import type {I18nLocale} from './type';

type EnhancedMenuItemProps = {
  to: string;
  target: string;
  isExternal?: boolean;
};

export type ChildEnhancedMenuItem = ChildMenuItemFragment &
  EnhancedMenuItemProps;

export type ParentEnhancedMenuItem = (ParentMenuItemFragment &
  EnhancedMenuItemProps) & {
  items: ChildEnhancedMenuItem[];
};

export type EnhancedMenu = Pick<MenuFragment, 'id'> & {
  items: ParentEnhancedMenuItem[];
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function missingClass(string?: string, prefix?: string) {
  if (!string) {
    return true;
  }

  const regex = new RegExp(` ?${prefix}`, 'g');
  return string.match(regex) === null;
}

export function formatText(input?: string | React.ReactNode) {
  if (!input) {
    return;
  }

  if (typeof input !== 'string') {
    return input;
  }

  return typographicBase(input, {locale: 'en-us'}).replace(
    /\s([^\s<]+)\s*$/g,
    '\u00A0$1',
  );
}

export function getExcerpt(text: string) {
  const regex = /<p.*>(.*?)<\/p>/;
  const match = regex.exec(text);
  return match?.length ? match[0] : text;
}

export function isNewArrival(date: string, daysOld = 30) {
  return (
    new Date(date).valueOf() >
    new Date().setDate(new Date().getDate() - daysOld).valueOf()
  );
}

export function isDiscounted(price: MoneyV2, compareAtPrice: MoneyV2) {
  if (compareAtPrice?.amount > price?.amount) {
    return true;
  }
  return false;
}

function resolveToFromType(
  {
    customPrefixes,
    pathname,
    type,
  }: {
    customPrefixes: Record<string, string>;
    pathname?: string;
    type?: string;
  } = {
    customPrefixes: {},
  },
) {
  if (!pathname || !type) return '';

  /*
    MenuItemType enum
    @see: https://shopify.dev/api/storefront/unstable/enums/MenuItemType
  */
  const defaultPrefixes = {
    BLOG: 'blogs',
    COLLECTION: 'collections',
    COLLECTIONS: 'collections', // Collections All (not documented)
    FRONTPAGE: 'frontpage',
    HTTP: '',
    PAGE: 'pages',
    CATALOG: 'collections/all', // Products All
    PRODUCT: 'products',
    SEARCH: 'search',
    SHOP_POLICY: 'policies',
  };

  const pathParts = pathname.split('/');
  const handle = pathParts.pop() || '';
  const routePrefix: Record<string, string> = {
    ...defaultPrefixes,
    ...customPrefixes,
  };

  switch (true) {
    // special cases
    case type === 'FRONTPAGE':
      return '/';

    case type === 'ARTICLE': {
      const blogHandle = pathParts.pop();
      return routePrefix.BLOG
        ? `/${routePrefix.BLOG}/${blogHandle}/${handle}/`
        : `/${blogHandle}/${handle}/`;
    }

    case type === 'COLLECTIONS':
      return `/${routePrefix.COLLECTIONS}`;

    case type === 'SEARCH':
      return `/${routePrefix.SEARCH}`;

    case type === 'CATALOG':
      return `/${routePrefix.CATALOG}`;

    // common cases: BLOG, PAGE, COLLECTION, PRODUCT, SHOP_POLICY, HTTP
    default:
      return routePrefix[type]
        ? `/${routePrefix[type]}/${handle}`
        : `/${handle}`;
  }
}

/*
  Parse each menu link and adding, isExternal, to and target
*/
function parseItem(primaryDomain: string, env: Env, customPrefixes = {}) {
  return function (
    item:
      | MenuFragment['items'][number]
      | MenuFragment['items'][number]['items'][number],
  ):
    | EnhancedMenu['items'][0]
    | EnhancedMenu['items'][number]['items'][0]
    | null {
    if (!item?.url || !item?.type) {
      console.warn('Invalid menu item.  Must include a url and type.');
      return null;
    }

    // extract path from url because we don't need the origin on internal to attributes
    const {host, pathname} = new URL(item.url);

    const isInternalLink =
      host === new URL(primaryDomain).host || host === env.PUBLIC_STORE_DOMAIN;

    const parsedItem = isInternalLink
      ? // internal links
        {
          ...item,
          isExternal: false,
          target: '_self',
          to: resolveToFromType({type: item.type, customPrefixes, pathname}),
        }
      : // external links
        {
          ...item,
          isExternal: true,
          target: '_blank',
          to: item.url,
        };

    if ('items' in item) {
      return {
        ...parsedItem,
        items: item.items
          .map(parseItem(primaryDomain, env, customPrefixes))
          .filter(Boolean),
      } as EnhancedMenu['items'][number];
    } else {
      return parsedItem as EnhancedMenu['items'][number]['items'][number];
    }
  };
}

/*
  Recursively adds `to` and `target` attributes to links based on their url
  and resource type.
  It optionally overwrites url paths based on item.type
*/
export function parseMenu(
  menu: MenuFragment,
  primaryDomain: string,
  env: Env,
  customPrefixes = {},
): EnhancedMenu | null {
  if (!menu?.items) {
    console.warn('Invalid menu passed to parseMenu');
    return null;
  }

  const parser = parseItem(primaryDomain, env, customPrefixes);

  const parsedMenu = {
    ...menu,
    items: menu.items.map(parser).filter(Boolean),
  } as EnhancedMenu;

  return parsedMenu;
}

export const INPUT_STYLE_CLASSES =
  'appearance-none rounded dark:bg-transparent border focus:border-primary/50 focus:ring-0 w-full py-2 px-3 text-primary/90 placeholder:text-primary/50 leading-tight focus:shadow-outline';

export const getInputStyleClasses = (isError?: string | null) => {
  return `${INPUT_STYLE_CLASSES} ${
    isError ? 'border-red-500' : 'border-primary/20'
  }`;
};

export function statusMessage(status: FulfillmentStatus) {
  const translations: Record<FulfillmentStatus, string> = {
    SUCCESS: 'Success',
    PENDING: 'Pending',
    OPEN: 'Open',
    FAILURE: 'Failure',
    ERROR: 'Error',
    CANCELLED: 'Cancelled',
  };
  try {
    return translations?.[status];
  } catch (error) {
    return status;
  }
}

export const DEFAULT_LOCALE: I18nLocale = Object.freeze({
  ...countries.default,
  pathPrefix: '',
});

export function getLocaleFromRequest(request: Request): I18nLocale {
  const url = new URL(request.url);
  const firstPathPart =
    '/' + url.pathname.substring(1).split('/')[0].toLowerCase();

  return countries[firstPathPart]
    ? {
        ...countries[firstPathPart],
        pathPrefix: firstPathPart,
      }
    : {
        ...countries['default'],
        pathPrefix: '',
      };
}

export function usePrefixPathWithLocale(path: string) {
  // Dummy values for rootData and selectedLocale
  const rootData = {selectedLocale: {pathPrefix: '/en'}}; // Replace '/en' with any default path prefix
  const DEFAULT_LOCALE = {pathPrefix: '/default'};

  const selectedLocale = rootData?.selectedLocale ?? DEFAULT_LOCALE;

  return `${selectedLocale.pathPrefix}${
    path.startsWith('/') ? path : '/' + path
  }`;
}

//export function useIsHomePath() {
//  const {pathname} = useLocation();
//  const rootData = useRouteLoaderData<RootLoader>('root');
//  const selectedLocale = rootData?.selectedLocale ?? DEFAULT_LOCALE;
//  const strippedPathname = pathname.replace(selectedLocale.pathPrefix, '');
//  return strippedPathname === '/';
//}

export function parseAsCurrency(value: number, locale: I18nLocale) {
  return new Intl.NumberFormat(locale.language + '-' + locale.country, {
    style: 'currency',
    currency: locale.currency,
  }).format(value);
}

/**
 * Validates that a url is local
 * @param url
 * @returns `true` if local `false`if external domain
 */
//export function isLocalPath(url: string) {
//  try {
//    // We don't want to redirect cross domain,
//    // doing so could create fishing vulnerability
//    // If `new URL()` succeeds, it's a fully qualified
//    // url which is cross domain. If it fails, it's just
//    // a path, which will be the current domain.
//    new URL(url);
//  } catch (e) {
//    return true;
//  }

//  return false;
//}

export function useTranslation() {
  const rootData = useRouteLoaderData<RootLoader>('root');

  const language = (
    rootData?.consent.language ?? DEFAULT_LOCALE.language
  ).toLowerCase() as keyof typeof translations;
  const translation = translations[language];

  const t = (
    key: keyof typeof translation | string,
    variables?: Record<string, string | number>,
  ): string => {
    let translatedText = translation[key as keyof typeof translation] as string;

    if (typeof translatedText !== 'string') {
      translatedText = key;
    }

    if (variables) {
      Object.keys(variables).forEach((variable) => {
        const regex = new RegExp(`{${variable}}`, 'g');
        translatedText = translatedText.replace(
          regex,
          variables[variable].toString(),
        );
      });
    }

    return translatedText;
  };

  return {t, language, translation};
}

//export function sortFilters(a: Filter, b: Filter) {
//  const isAvailability = (id: string) => id.includes('availability');
//  const isPrice = (id: string) => id.includes('price');

//  if (isAvailability(a.id) && isPrice(b.id)) return -1;
//  if (isPrice(a.id) && isAvailability(b.id)) return 1;
//  if (isAvailability(a.id) && !isAvailability(b.id)) return 1;
//  if (!isAvailability(a.id) && isAvailability(b.id)) return -1;
//  if (isPrice(a.id) && !isPrice(b.id)) return 1;
//  if (!isPrice(a.id) && isPrice(b.id)) return -1;

//  return 1;
//}

/**
 * Generate alternate URLs for different languages
 * @param url - The full URL of the current page
 * @returns An array of objects representing alternate language URLs
 */
export function getAlternates(
  url: string,
): Array<{language: string; url: string}> {
  const urlObj = new URL(url || '');
  const origin = urlObj.origin;

  const cleanPathname = urlObj.pathname.replace(/^\/ru\//, '/');

  return urlObj.search.length === 0
    ? [
        {
          language: 'uk',
          url: `${origin}${cleanPathname}`,
        },
        {
          language: 'ru',
          url: `${origin}/ru${cleanPathname}`,
        },
        {
          language: 'x-default',
          url: `${origin}${cleanPathname}`,
        },
      ]
    : [];
}

export const formatDateForTimeTag = (isoString: string) => {
  const [datePart] = isoString.split('T');

  const [year, month, day] = datePart.split('-').map(Number);

  const monthNames = [
    'січня',
    'лютого',
    'березня',
    'квітня',
    'травня',
    'червня',
    'липня',
    'серпня',
    'вересня',
    'жовтня',
    'листопада',
    'грудня',
  ];

  const displayDate = `${day} ${monthNames[month - 1]} ${year} р.`;

  const dateTime = isoString;

  return {
    dateTime,
    displayDate,
  };
};

type PolicyType = Pick<ShopPolicy, 'handle' | 'body'> | null | undefined;

interface ProductDetailsInput {
  descriptionHtml?: string;
  shippingPolicy: PolicyType;
  refundPolicy: PolicyType;
  translation: Record<string, string>;
}

interface ProductDetailItem {
  title: string;
  content: string;
  learnMore?: string;
}

export function formatProductDetails({
  descriptionHtml,
  shippingPolicy,
  refundPolicy,
  translation,
}: ProductDetailsInput): ProductDetailItem[] {
  const details: ProductDetailItem[] = [];

  if (descriptionHtml) {
    details.push({
      title: translation.description,
      content: descriptionHtml,
      learnMore: '',
    });
  }

  if (shippingPolicy?.body) {
    details.push({
      title: translation.shipping,
      content: getExcerpt(shippingPolicy.body),
      learnMore: `/policies/${shippingPolicy.handle}`,
    });
  }

  if (refundPolicy?.body) {
    details.push({
      title: translation.returns,
      content: getExcerpt(refundPolicy.body),
      learnMore: `/policies/${refundPolicy.handle}`,
    });
  }

  return details;
}

export async function submitReviewAction({
  request,
  context,
  params,
}: LoaderFunctionArgs) {
  const formData = await request.formData();
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const rating = parseInt(formData.get('rating') as string);
  const title = name;
  const body = formData.get('body') as string;
  const productId = formData.get('productId') as string;

  if (!name || !email || !rating || !title || !body) {
    return {success: false, error: 'All fields are required'};
  }

  // Extract the numeric product ID from the global ID
  const id = productId.split('/').pop();
  if (!id) {
    return {success: false, error: 'Invalid product ID'};
  }

  try {
    await addJudgemeReview({
      api_token: context.env.JUDGEME_PUBLIC_TOKEN,
      shop_domain: context.env.PUBLIC_STORE_DOMAIN,
      id,
      email,
      name,
      rating,
      title,
      body,
    });

    return {success: true};
  } catch (error) {
    console.error('Error submitting review:', error);
    return {
      success: false,
      error:
        'There was an error submitting your review. Please try again later.',
    };
  }
}

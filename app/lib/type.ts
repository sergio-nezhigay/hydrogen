import type {Storefront as HydrogenStorefront} from '@shopify/hydrogen';
import type {
  CountryCode,
  CurrencyCode,
  LanguageCode,
} from '@shopify/hydrogen/storefront-api-types';

export type NonNullableFields<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

export type Locale = {
  language: LanguageCode;
  country: CountryCode;
  label: string;
  currency: CurrencyCode;
};

export type Localizations = Record<string, Locale>;

export type I18nLocale = Locale & {
  pathPrefix: string;
};

export type Storefront = HydrogenStorefront<I18nLocale>;

export type JudgemeProductData = {
  product: {
    id: string;
    handle: string;
  };
};

export type JudgemeReview = {
  id: number;
  title: string | null;
  body: string;
  rating: number;
  product_external_id: number;
  reviewer: {
    id: number;
    external_id: string | null;
    email: string;
    name: string;
    phone: string | null;
    accepts_marketing: boolean;
    unsubscribed_at: string | null;
    tags: string | null;
  };
  source: string;
  curated: string;
  published: boolean;
  hidden: boolean;
  verified: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
  has_published_pictures: boolean;
  has_published_videos: boolean;
  pictures: string[];
  ip_address: string | null;
  product_title: string;
  product_handle: string;
};

export type JudgemeReviewsData = {
  rating: number;
  reviewNumber: number;
  reviews: JudgemeReview[];
};

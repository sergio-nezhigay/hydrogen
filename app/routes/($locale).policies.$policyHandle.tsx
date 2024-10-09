import {
  json,
  type MetaArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import invariant from 'tiny-invariant';
import {getSeoMeta} from '@shopify/hydrogen';

import {Section} from '~/components/Text';
import {Button} from '~/components/Button';
import {routeHeaders} from '~/data/cache';
import {seoPayload} from '~/lib/seo.server';
import {cn, useTranslation} from '~/lib/utils';
import {navigationMenuTriggerStyle} from '~/components/ui/navigation-menu';

export const headers = routeHeaders;

export async function loader({request, params, context}: LoaderFunctionArgs) {
  invariant(params.policyHandle, 'Missing policy handle');

  const policyName = params.policyHandle.replace(
    /-([a-z])/g,
    (_: unknown, m1: string) => m1.toUpperCase(),
  ) as 'privacyPolicy' | 'shippingPolicy' | 'termsOfService' | 'refundPolicy';

  const data = await context.storefront.query(POLICY_CONTENT_QUERY, {
    variables: {
      privacyPolicy: false,
      shippingPolicy: false,
      termsOfService: false,
      refundPolicy: false,
      [policyName]: true,
      language: context.storefront.i18n.language,
    },
  });

  invariant(data, 'No data returned from Shopify API');
  const policy = data.shop?.[policyName];

  if (!policy) {
    throw new Response(null, {status: 404});
  }

  const seo = seoPayload.policy({policy, url: request.url});

  return json({policy, seo});
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function Policies() {
  const {policy} = useLoaderData<typeof loader>();
  const {translation} = useTranslation();
  const {t} = useTranslation();

  return (
    <>
      <Section heading={t(policy.title)} padding="y" useH1 className="py-8">
        <Button
          className={cn(
            navigationMenuTriggerStyle(),
            'justify-self-start bg-stone-50',
          )}
          variant="inline"
          to={'/policies'}
        >
          &larr; {translation.back_to_policies}
        </Button>
        <div className="flex-grow w-full md:w-7/12">
          <div
            dangerouslySetInnerHTML={{__html: policy.body}}
            className="prose dark:prose-invert"
          />
        </div>
      </Section>
    </>
  );
}

const POLICY_CONTENT_QUERY = `#graphql
  fragment PolicyHandle on ShopPolicy {
    body
    handle
    id
    title
    url
  }

  query PoliciesHandle(
    $language: LanguageCode
    $privacyPolicy: Boolean!
    $shippingPolicy: Boolean!
    $termsOfService: Boolean!
    $refundPolicy: Boolean!
  ) @inContext(language: $language) {
    shop {
      privacyPolicy @include(if: $privacyPolicy) {
        ...PolicyHandle
      }
      shippingPolicy @include(if: $shippingPolicy) {
        ...PolicyHandle
      }
      termsOfService @include(if: $termsOfService) {
        ...PolicyHandle
      }
      refundPolicy @include(if: $refundPolicy) {
        ...PolicyHandle
      }
    }
  }
`;

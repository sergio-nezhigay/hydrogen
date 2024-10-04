import clsx from 'clsx';
import {flattenConnection, Image, useMoney} from '@shopify/hydrogen';
import type {MoneyV2, Product} from '@shopify/hydrogen/storefront-api-types';

import type {ProductCardFragment} from 'storefrontapi.generated';
import {Text} from '~/components/Text';
import {Link} from '~/components/Link';
import {Button} from '~/components/Button';
import {AddToCartButton} from '~/components/AddToCartButton';
import {isDiscounted, isNewArrival, useTranslation} from '~/lib/utils';
import {getProductPlaceholder} from '~/lib/placeholders';
import {HryvniaMoney} from '~/components/HryvniaMoney';

export type ProductCardProps = {
  product: ProductCardFragment;
  label?: string;
  className?: string;
  loading?: HTMLImageElement['loading'];
  onClick?: () => void;
  quickAdd?: boolean;
};

export function ProductCard({
  product,
  label,
  className,
  loading,
  onClick,
  quickAdd,
}: ProductCardProps) {
  let cardLabel;
  const {translation} = useTranslation();
  const cardProduct: Product = product?.variants
    ? (product as Product)
    : getProductPlaceholder();
  if (!cardProduct?.variants?.nodes?.length) return null;

  const delta = product.delta?.value || '';
  const supplier = product.supplier?.value || '';
  const meta = {delta, supplier};

  const firstVariant = flattenConnection(cardProduct.variants)[0];

  if (!firstVariant) return null;
  const {image, price, compareAtPrice} = firstVariant;

  if (label) {
    cardLabel = label;
  } else if (isDiscounted(price as MoneyV2, compareAtPrice as MoneyV2)) {
    cardLabel = 'Розпродаж';
  } else if (isNewArrival(product.publishedAt)) {
    cardLabel = 'Новинка';
  }

  return (
    <div className="flex flex-col gap-2 group">
      <Link
        onClick={onClick}
        to={`/products/${product.handle}`}
        prefetch="viewport"
      >
        <div className={clsx('grid gap-4', className)}>
          <div className="card-image bg-primary/5 group-hover:shadow-hover transition-shadow duration-300">
            {image && (
              <Image
                className="w-full object-cover test"
                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, 50vw"
                aspectRatio="4/5"
                data={image}
                alt={image.altText || `Зображення ${product.title}`}
                loading={loading}
              />
            )}

            <Text
              size="fine"
              className="absolute right-0 top-0 m-4 text-right text-notice"
            >
              {cardLabel}
            </Text>
          </div>
          <div className="grid gap-1 sm-max:px-2 transition-colors duration-300  group-hover:text-indigo-600 ">
            <Text
              className="w-full truncate line-clamp-2 lg:line-clamp-3 group-hover:underline"
              as="h3"
            >
              {product.title}
            </Text>
            <div className="flex gap-4">
              <Text className="flex gap-4">
                <HryvniaMoney data={price} />
                {isDiscounted(price as MoneyV2, compareAtPrice as MoneyV2) && (
                  <CompareAtPrice
                    className={'opacity-50'}
                    data={compareAtPrice as MoneyV2}
                  />
                )}
              </Text>
            </div>
          </div>
        </div>
      </Link>
      {quickAdd && firstVariant.availableForSale && (
        <AddToCartButton
          lines={[
            {
              quantity: 1,
              merchandiseId: firstVariant.id,
            },
          ]}
          delta={delta}
          meta={meta}
        >
          <Text as="span" className="flex-center gap-2">
            {translation.buy}
          </Text>
        </AddToCartButton>
      )}
      {quickAdd && !firstVariant.availableForSale && (
        <Button variant="secondary" className="mt-2" disabled>
          <Text as="span" className="flex items-center justify-center gap-2">
            {translation.sold_out}
          </Text>
        </Button>
      )}
    </div>
  );
}

function CompareAtPrice({
  data,
  className,
}: {
  data: MoneyV2;
  className?: string;
}) {
  const {currencyNarrowSymbol, withoutTrailingZerosAndCurrency} =
    useMoney(data);

  const styles = clsx('strike', className);

  return (
    <span className={styles}>
      {currencyNarrowSymbol}
      {withoutTrailingZerosAndCurrency}
    </span>
  );
}

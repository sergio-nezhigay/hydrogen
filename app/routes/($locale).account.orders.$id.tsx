import clsx from 'clsx';
import {redirect} from '@shopify/remix-oxygen';
import type {HeadersFunction, LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {Image, flattenConnection} from '@shopify/hydrogen';
import type {FulfillmentStatus} from '@shopify/hydrogen/customer-account-api-types';

import {translations} from '~/data/translations';
import type {OrderFragment} from 'customer-accountapi.generated';
import {statusMessage} from '~/lib/utils';
import {Link} from '~/components/Link';
import {Heading, Section, Text} from '~/components/Text';
import {CUSTOMER_ORDER_QUERY} from '~/graphql/customer-account/CustomerOrderQuery';
import {HryvniaMoney} from '~/components/HryvniaMoney';

export const headers: HeadersFunction = ({loaderHeaders}) => loaderHeaders;

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Order ${data?.order?.name}`}];
};

export async function loader({request, context, params}: LoaderFunctionArgs) {
  if (!params.id) {
    return redirect(params?.locale ? `${params.locale}/account` : '/account');
  }
  const {productHandle, locale = 'uk'} = params;
  const translation = translations[locale as keyof typeof translations];
  const queryParams = new URL(request.url).searchParams;
  const orderToken = queryParams.get('key');

  try {
    const orderId = orderToken
      ? `gid://shopify/Order/${params.id}?key=${orderToken}`
      : `gid://shopify/Order/${params.id}`;

    const {data, errors} = await context.customerAccount.query(
      CUSTOMER_ORDER_QUERY,
      {variables: {orderId}},
    );

    if (errors?.length || !data?.order || !data?.order?.lineItems) {
      throw new Error('order information');
    }

    const order: OrderFragment = data.order;

    const lineItems = flattenConnection(order.lineItems);

    const discountApplications = flattenConnection(order.discountApplications);

    const firstDiscount = discountApplications[0]?.value;

    const discountValue =
      firstDiscount?.__typename === 'MoneyV2' && firstDiscount;

    const discountPercentage =
      firstDiscount?.__typename === 'PricingPercentageValue' &&
      firstDiscount?.percentage;

    const fulfillments = flattenConnection(order.fulfillments);

    const fulfillmentStatus =
      fulfillments.length > 0
        ? fulfillments[0].status
        : ('OPEN' as FulfillmentStatus);

    return data(
      {
        order,
        lineItems,
        discountValue,
        discountPercentage,
        fulfillmentStatus,
        translation,
      },
      {
        headers: {
          'Set-Cookie': await context.session.commit(),
        },
      },
    );
  } catch (error) {
    throw new Response(error instanceof Error ? error.message : undefined, {
      status: 404,
      headers: {
        'Set-Cookie': await context.session.commit(),
      },
    });
  }
}

export default function OrderRoute() {
  const {
    order,
    lineItems,
    discountValue,
    discountPercentage,
    fulfillmentStatus,
    translation,
  } = useLoaderData<typeof loader>();
  return (
    <Section
      heading="Деталі замовлення"
      headingClassName="text-center mx-auto"
      padding="y"
      useH1
      className="py-8"
    >
      <Link to="/account">
        <Text color="subtle">Перейти в деталі акаунта</Text>
      </Link>
      <div className="w-full p-6 sm:grid-cols-1 md:p-8 lg:p-12 lg:py-6">
        <div>
          <Text as="h3" size="lead">
            Замовлення №{order.name}
          </Text>
          <Text className="mt-2" as="p">
            Дата обробки {new Date(order.processedAt!).toDateString()}
          </Text>
          <div className="grid items-start gap-12 sm:grid-cols-1 md:grid-cols-4 md:gap-16 sm:divide-y sm:divide-gray-200">
            <table className="min-w-full my-8 divide-y divide-gray-300 md:col-span-3">
              <thead>
                <tr className="align-baseline ">
                  <th
                    scope="col"
                    className="pb-4 pl-0 pr-3 font-semibold text-left"
                  >
                    Товар
                  </th>
                  <th
                    scope="col"
                    className="hidden px-4 pb-4 font-semibold text-right sm:table-cell md:table-cell"
                  >
                    Ціна
                  </th>
                  <th
                    scope="col"
                    className="hidden px-4 pb-4 font-semibold text-right sm:table-cell md:table-cell"
                  >
                    Кількість
                  </th>
                  <th
                    scope="col"
                    className="px-4 pb-4 font-semibold text-right"
                  >
                    Загалом
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {lineItems.map((lineItem) => (
                  <tr key={lineItem.id}>
                    <td className="w-full py-4 pl-0 pr-3 align-top sm:align-middle max-w-0 sm:w-auto sm:max-w-none">
                      <div className="flex gap-6">
                        {lineItem?.image && (
                          <div className="w-24 card-image aspect-square">
                            <Image
                              data={lineItem.image}
                              width={96}
                              height={96}
                            />
                          </div>
                        )}
                        <div className="flex-col justify-center hidden lg:flex">
                          <Text as="p">{lineItem.title}</Text>
                          <Text size="fine" className="mt-1" as="p">
                            {lineItem.variantTitle}
                          </Text>
                        </div>
                        <dl className="grid">
                          <dt className="sr-only">Товар</dt>
                          <dd className="truncate lg:hidden">
                            <Heading size="copy" format as="h3">
                              {lineItem.title}
                            </Heading>
                            <Text size="fine" className="mt-1">
                              {lineItem.variantTitle}
                            </Text>
                          </dd>
                          <dt className="sr-only">Ціна</dt>
                          <dd className="truncate sm:hidden">
                            <Text size="fine" className="mt-4">
                              <HryvniaMoney data={lineItem.price!} />
                            </Text>
                          </dd>
                          <dt className="sr-only">Кількість</dt>
                          <dd className="truncate sm:hidden">
                            <Text className="mt-1" size="fine">
                              К-ть: {lineItem.quantity}
                            </Text>
                          </dd>
                        </dl>
                      </div>
                    </td>
                    <td className="hidden px-3 py-4 text-right align-top sm:align-middle sm:table-cell">
                      <HryvniaMoney data={lineItem.price!} />
                    </td>
                    <td className="hidden px-3 py-4 text-right align-top sm:align-middle sm:table-cell">
                      {lineItem.quantity}
                    </td>
                    <td className="px-3 py-4 text-right align-top sm:align-middle sm:table-cell">
                      <Text>
                        <HryvniaMoney data={lineItem.totalDiscount!} />
                        {/*<Money data={lineItem.totalDiscount!} />*/}
                      </Text>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                {((discountValue && discountValue.amount) ||
                  discountPercentage) && (
                  <tr>
                    <th
                      scope="row"
                      colSpan={3}
                      className="hidden pt-6 pl-6 pr-3 font-normal text-right sm:table-cell md:pl-0"
                    >
                      <Text>Знижки</Text>
                    </th>
                    <th
                      scope="row"
                      className="pt-6 pr-3 font-normal text-left sm:hidden"
                    >
                      <Text>Знижки</Text>
                    </th>
                    <td className="pt-6 pl-3 pr-4 font-medium text-right text-green-700 md:pr-3">
                      {discountPercentage ? (
                        <span className="text-sm">
                          -{discountPercentage}% дешевше
                        </span>
                      ) : (
                        discountValue && <HryvniaMoney data={discountValue!} />
                        //discountValue && <Money data={discountValue!} />
                      )}
                    </td>
                  </tr>
                )}
                <tr>
                  <th
                    scope="row"
                    colSpan={3}
                    className="hidden pt-6 pl-6 pr-3 font-normal text-right sm:table-cell md:pl-0"
                  >
                    <Text>{translation.subtotal}</Text>
                  </th>
                  <th
                    scope="row"
                    className="pt-6 pr-3 font-normal text-left sm:hidden"
                  >
                    <Text>{translation.subtotal}</Text>
                  </th>
                  <td className="pt-6 pl-3 pr-4 text-right md:pr-3">
                    <HryvniaMoney data={order.subtotal!} />
                  </td>
                </tr>

                <tr>
                  <th
                    scope="row"
                    colSpan={3}
                    className="hidden pt-4 pl-6 pr-3 font-semibold text-right sm:table-cell md:pl-0"
                  >
                    Усього
                  </th>
                  <th
                    scope="row"
                    className="pt-4 pr-3 font-semibold text-left sm:hidden"
                  >
                    <Text>Загалом</Text>
                  </th>
                  <td className="pt-4 pl-3 pr-4 font-semibold text-right md:pr-3">
                    <HryvniaMoney data={order.totalPrice!} />
                  </td>
                </tr>
              </tfoot>
            </table>
            <div className="sticky border-none top-nav md:my-8">
              <Heading size="copy" className="font-semibold" as="h3">
                Адреса доставки
              </Heading>
              {order?.shippingAddress ? (
                <ul className="mt-6">
                  <li>
                    <Text>{order.shippingAddress.name}</Text>
                  </li>
                  {order?.shippingAddress?.formatted ? (
                    order.shippingAddress.formatted.map((line: string) => (
                      <li key={line}>
                        <Text>{line}</Text>
                      </li>
                    ))
                  ) : (
                    <></>
                  )}
                </ul>
              ) : (
                <p className="mt-3">Адреса не заповнена</p>
              )}
              <Heading size="copy" className="mt-8 font-semibold" as="h3">
                Стан
              </Heading>
              {fulfillmentStatus && (
                <div
                  className={clsx(
                    `mt-3 px-3 py-1 text-xs font-medium rounded-full inline-block w-auto`,
                    fulfillmentStatus === 'SUCCESS'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-primary/20 text-primary/50',
                  )}
                >
                  <Text size="fine">{statusMessage(fulfillmentStatus!)}</Text>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

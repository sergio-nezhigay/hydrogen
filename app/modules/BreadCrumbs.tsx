import {
  useMatches,
  useRouteLoaderData,
  Link,
  useLocation,
} from '@remix-run/react';
import {Home} from 'lucide-react';
import clsx from 'clsx';

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';
import {Section} from '~/components/Text';
import {useTranslation} from '~/lib/utils';
import type {RootLoader} from '~/root';
import {ScrollArea, ScrollBar} from '~/components/ui/scroll-area';

export type TBreadcrumbType = 'collections' | 'collection' | 'product';

interface RouteHandle {
  breadcrumbType?: TBreadcrumbType;
}

interface Collection {
  handle: string;
  title: string;
}

interface Product {
  handle: string;
  title: string;
  collections: {nodes: Collection[]};
}

interface RouteData {
  collection?: Collection;
  product?: Product;
}

interface Route {
  handle?: RouteHandle;
  data?: RouteData;
}

function BreadCrumbs() {
  const matches = useMatches();
  const {translation} = useTranslation();
  const deepestRoute = matches.at(-1) as Route | undefined;
  const rootData = useRouteLoaderData<RootLoader>('root');
  const baseUrl = new URL(rootData?.seo?.url ?? '').origin;
  const location = useLocation();

  const isRuPage = location.pathname.startsWith('/ru');

  if (!deepestRoute?.handle) return null;

  const {handle, data} = deepestRoute;

  const breadcrumbType: TBreadcrumbType | null = [
    'collections',
    'collection',
    'product',
  ].includes(handle?.breadcrumbType ?? '')
    ? (handle?.breadcrumbType as TBreadcrumbType)
    : null;

  if (!breadcrumbType) return null;

  const pages: {href: string; name: string}[] = [{href: '/', name: 'Home'}];

  switch (breadcrumbType) {
    case 'collections':
      pages.push({
        href: '/collections',
        name: translation.collections,
      });
      break;
    case 'collection':
      pages.push({
        href: `/collections/${data?.collection?.handle}`,
        name: data?.collection?.title || translation.collections,
      });
      break;
    case 'product':
      const collection = data?.product?.collections.nodes.at(0);
      if (collection) {
        pages.push({
          href: `/collections/${collection.handle}`,
          name: collection.title,
        });
      }
      pages.push({
        href: `/products/${data?.product?.handle ?? ''}`,
        name: data?.product?.title ?? 'Product',
      });
      break;
    default:
      break;
  }

  return (
    <Section heading="Breadcrumbs" headingClassName="sr-only" padding="y">
      <ScrollArea className="sm-max:flex sm-max:w-[calc(100vw_-_32px)] sm-max:overflow-x-auto sm-max:h-8">
        <Breadcrumb>
          <BreadcrumbList>
            {pages.map((page, idx) => {
              const urlWithPrefix = isRuPage
                ? new URL(`/ru${page.href}`, baseUrl).href
                : new URL(`${page.href}`, baseUrl).href;

              return (
                <BreadcrumbItem key={page.name}>
                  {idx < pages.length - 1 ? (
                    <BreadcrumbLink asChild>
                      <Link
                        to={urlWithPrefix}
                        className={clsx(
                          'hover:text-indigo-600 hover:underline whitespace-nowrap md:text-base font-semibold',
                        )}
                        prefetch="viewport"
                      >
                        {page.name === 'Home' ? (
                          <>
                            <Home className="size-5 font-bold" />
                            <span className="sr-only">Головна сторінка</span>
                          </>
                        ) : (
                          page.name
                        )}
                      </Link>
                    </BreadcrumbLink>
                  ) : (
                    <span className="font-narrow md:text-base sm-max:whitespace-nowrap">
                      {page.name}
                    </span>
                  )}
                  {idx < pages.length - 1 && <BreadcrumbSeparator />}
                </BreadcrumbItem>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </Section>
  );
}

export default BreadCrumbs;

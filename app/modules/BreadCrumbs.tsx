import {
  useMatches,
  useRouteLoaderData,
  Link,
  useLocation,
} from '@remix-run/react';
import {z} from 'zod';
import {Home} from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';
import {Section} from '~/components/Text';
import {useTranslation} from '~/lib/utils';
import clsx from 'clsx';
import {RootLoader} from '~/root';

export const breadcrumbTypeSchema = z.enum([
  'collections',
  'collection',
  'product',
]);
export type TBreadcrumbType = z.infer<typeof breadcrumbTypeSchema>;

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

  const parsedBreadcrumbType = breadcrumbTypeSchema.safeParse(
    handle?.breadcrumbType,
  );
  if (!parsedBreadcrumbType.success) return null;

  const pages: {href: string; name: string}[] = [{href: '/', name: 'Home'}];

  switch (parsedBreadcrumbType.data) {
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
      <Breadcrumb>
        <BreadcrumbList>
          {pages.map((page, idx) => {
            const urlWithPrefix = isRuPage
              ? new URL(`/ru${page.href}`, baseUrl).href
              : new URL(`${page.href}`, baseUrl).href;

            return (
              <BreadcrumbItem key={page.name} className="text-primary">
                {idx < pages.length - 1 ? (
                  <BreadcrumbLink asChild>
                    <Link
                      to={urlWithPrefix}
                      className={clsx('hover:text-indigo-600 hover:underline')}
                      prefetch="viewport"
                    >
                      {page.name === 'Home' ? (
                        <>
                          <Home className="size-5" />
                          <span className="sr-only">Головна сторінка</span>
                        </>
                      ) : (
                        page.name
                      )}
                    </Link>
                  </BreadcrumbLink>
                ) : (
                  <span>{page.name}</span>
                )}
                {idx < pages.length - 1 && <BreadcrumbSeparator />}
              </BreadcrumbItem>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </Section>
  );
}

export default BreadCrumbs;

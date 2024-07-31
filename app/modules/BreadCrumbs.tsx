import {useMatches} from '@remix-run/react';
import {Link} from '~/components/Link';
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
  collections: {
    nodes: Collection[];
  };
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
  const translation = useTranslation();
  const deepestRoute = matches.at(-1) as Route | undefined;
  // Return null if the current route is the home page
  if (!deepestRoute?.handle) {
    return null;
  }

  const handle = deepestRoute?.handle;

  const parsedBreadcrumbType = breadcrumbTypeSchema.safeParse(
    handle?.breadcrumbType,
  );
  const isValidBreadcrumbType = parsedBreadcrumbType.success;
  const pages: {href: string; name: string}[] = [{href: '/', name: 'Home'}];

  if (isValidBreadcrumbType) {
    switch (parsedBreadcrumbType.data) {
      case 'collections':
        pages.push({
          href: '/collections',
          name: translation.collections,
        });
        break;
      case 'collection':
        pages.push({
          href: `/collections/${deepestRoute?.data?.collection?.handle}`,
          name:
            deepestRoute?.data?.collection?.title || translation.collections,
        });
        break;
      case 'product':
        const collection = deepestRoute?.data?.product?.collections.nodes.at(0);
        if (collection) {
          pages.push({
            href: `/collections/${collection.handle}`,
            name: collection.title,
          });
        }
        pages.push({
          href: `/products/${deepestRoute?.data?.product?.handle ?? ''}`,
          name: deepestRoute?.data?.product?.title ?? 'Product',
        });
        break;
      default:
        break;
    }
  }

  return (
    <Section heading="Breadcrumbs" headingClassName="sr-only" padding="y">
      <Breadcrumb>
        <BreadcrumbList>
          {pages.map((page, idx) => (
            <BreadcrumbItem key={page.name} className="text-primary">
              {idx < pages.length - 1 ? (
                <BreadcrumbLink asChild>
                  <Link
                    to={page.href}
                    className={clsx('hover:text-red', {
                      'hover:underline': page.name !== 'Home',
                    })}
                  >
                    {page.name === 'Home' ? (
                      <Home className="size-5" />
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
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </Section>
  );
}

export default BreadCrumbs;

import {useMatches} from '@remix-run/react';
import {z} from 'zod';

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
  const deepestRoute = matches.at(-1) as Route | undefined;

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
          name: 'Collections',
        });
        break;

      case 'collection':
        pages.push({
          href: '/collections',
          name: 'Collections',
        });
        pages.push({
          href: `/collections/${deepestRoute?.data?.collection?.handle}`,
          name: deepestRoute?.data?.collection?.title || 'Collection',
        });
        break;
      case 'product':
        pages.push({
          href: '/collections',
          name: 'Collections',
        });

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
    <nav className="flex" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-4">
        {pages.map((page, idx) => {
          const currentPage = idx === pages.length - 1;
          const homePage = page.href === '/';

          const separator = idx !== 0 && (
            <svg
              className="h-5 w-5 flex-shrink-0 text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 14.707a1 1 0 010-1.414L13.586 10 10.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          );

          return (
            <li key={page.name}>
              <div className="flex items-center">
                {separator}
                <span
                  className={`ml-4 text-sm font-medium ${
                    currentPage
                      ? 'text-gray-500'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  {currentPage ? (
                    page.name
                  ) : (
                    <a
                      href={page.href}
                      className="text-gray-700 hover:text-gray-900"
                    >
                      {homePage ? (
                        <svg
                          className="h-5 w-5 flex-shrink-0"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 3.293l5.707 5.707-1.414 1.414L10 6.414 5.707 10.414 4.293 9 10 3.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        page.name
                      )}
                    </a>
                  )}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default BreadCrumbs;

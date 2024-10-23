import {Link} from '@remix-run/react';
import {Image, Pagination} from '@shopify/hydrogen';

import {urlWithTrackingParams, type RegularSearchReturn} from '~/lib/search';
import {cn, useTranslation} from '~/lib/utils';

import {navigationMenuTriggerStyle} from './ui/navigation-menu';
import {HryvniaMoney} from './HryvniaMoney';

type SearchItems = RegularSearchReturn['result']['items'];
type PartialSearchResult<ItemType extends keyof SearchItems> = Pick<
  SearchItems,
  ItemType
> &
  Pick<RegularSearchReturn, 'term'>;

type SearchResultsProps = RegularSearchReturn & {
  children: (args: SearchItems & {term: string}) => React.ReactNode;
};

export function SearchResults({
  term,
  result,
  children,
}: Omit<SearchResultsProps, 'error' | 'type'>) {
  if (!result?.total) {
    return null;
  }

  return children({...result.items, term});
}

SearchResults.Articles = SearchResultsArticles;
SearchResults.Pages = SearchResultsPages;
SearchResults.Products = SearchResultsProducts;
SearchResults.Empty = SearchResultsEmpty;

function SearchResultsArticles({
  term,
  articles,
}: PartialSearchResult<'articles'>) {
  if (!articles?.nodes.length) {
    return null;
  }

  return (
    <div className="search-result">
      <h2>Статті</h2>
      <div>
        {articles?.nodes?.map((article) => {
          const articleUrl = urlWithTrackingParams({
            baseUrl: `/blogs/${article.handle}`,
            trackingParams: article.trackingParameters,
            term,
          });

          return (
            <div className="predictive-search-result-item" key={article.id}>
              <Link prefetch="intent" to={articleUrl} className="flex">
                {article.title}
              </Link>
            </div>
          );
        })}
      </div>
      <br />
    </div>
  );
}

function SearchResultsPages({term, pages}: PartialSearchResult<'pages'>) {
  if (!pages?.nodes.length) {
    return null;
  }

  return (
    <div className="search-result">
      <h2>Сторінки</h2>
      <div>
        {pages?.nodes?.map((page) => {
          const pageUrl = urlWithTrackingParams({
            baseUrl: `/pages/${page.handle}`,
            trackingParams: page.trackingParameters,
            term,
          });

          return (
            <div className="predictive-search-result-item" key={page.id}>
              <Link prefetch="intent" to={pageUrl}>
                {page.title}
              </Link>
            </div>
          );
        })}
      </div>
      <br />
    </div>
  );
}

function SearchResultsProducts({
  term,
  products,
}: PartialSearchResult<'products'>) {
  const {translation} = useTranslation();
  if (!products?.nodes.length) {
    return null;
  }
  return (
    <div className="search-result">
      <h2 className="font-bold mb-4 opacity-80">{translation.products}</h2>
      <Pagination connection={products}>
        {({nodes, isLoading, NextLink, PreviousLink}) => {
          const ItemsMarkup = nodes.map((product) => {
            const productUrl = urlWithTrackingParams({
              baseUrl: `/products/${product.handle}`,
              trackingParams: product.trackingParameters,
              term,
            });

            return (
              <div className="predictive-search-result-item" key={product.id}>
                <Link to={productUrl} className="flex" prefetch="viewport">
                  {product.variants.nodes[0].image && (
                    <Image
                      data={product.variants.nodes[0].image}
                      alt={product.title}
                      width={50}
                    />
                  )}
                  <div>
                    <p>{product.title}</p>

                    <HryvniaMoney data={product.variants.nodes[0].price} />
                  </div>
                </Link>
              </div>
            );
          });

          return (
            <div>
              <div>
                <PreviousLink
                  className={cn(navigationMenuTriggerStyle(), 'bg-slate-50')}
                >
                  {isLoading ? (
                    translation.loading
                  ) : (
                    <span>↑ {translation.prev}</span>
                  )}
                </PreviousLink>
              </div>
              <div>
                {ItemsMarkup}
                <br />
              </div>
              <div>
                <NextLink
                  className={cn(navigationMenuTriggerStyle(), 'bg-slate-50')}
                >
                  {isLoading ? (
                    translation.loading
                  ) : (
                    <span>{translation.next} ↓</span>
                  )}
                </NextLink>
              </div>
            </div>
          );
        }}
      </Pagination>
      <br />
    </div>
  );
}

function SearchResultsEmpty() {
  const {translation} = useTranslation();
  return <p>{translation.no_results}</p>;
}

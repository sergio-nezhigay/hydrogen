import {Await, Link} from '@remix-run/react';
import {Suspense} from 'react';

import type {CartApiQueryFragment, HeaderQuery} from 'storefrontapi.generated';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header, HeaderMenu} from '~/components/Header';
import {CartMain} from '~/components/CartMain';
import {
  SEARCH_ENDPOINT,
  SearchFormPredictive,
} from '~/components/SearchFormPredictive';
import {SearchResultsPredictive} from '~/components/SearchResultsPredictive';
import {useTranslation} from '~/lib/utils';
import BreadCrumbs from '~/modules/BreadCrumbs';
import ChatIcon from '~/modules/ChatIcon';

interface PageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>;

  header: HeaderQuery;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  children?: React.ReactNode;
}

export function PageLayout({
  cart,
  children = null,

  header,
  isLoggedIn,
  publicStoreDomain,
}: PageLayoutProps) {
  return (
    <Aside.Provider>
      <CartAside cart={cart} />
      <SearchAside />
      <MobileMenuAside header={header} publicStoreDomain={publicStoreDomain} />
      {header && (
        <Header
          header={header}
          cart={cart}
          isLoggedIn={isLoggedIn}
          publicStoreDomain={publicStoreDomain}
        />
      )}
      <main>
        <BreadCrumbs />
        {children}
      </main>
      <ChatIcon />
      <Footer />
    </Aside.Provider>
  );
}

function CartAside({cart}: {cart: PageLayoutProps['cart']}) {
  const {translation} = useTranslation();
  return (
    <Aside type="cart" heading={translation.basket}>
      <Suspense fallback={`<p>${translation.loading}...</p>`}>
        <Await resolve={cart}>
          {(cart) => {
            return <CartMain cart={cart} layout="aside" />;
          }}
        </Await>
      </Suspense>
    </Aside>
  );
}

function SearchAside() {
  const {translation, t} = useTranslation();

  return (
    <Aside type="search" heading={translation.search}>
      <div className="sm-max:h-[calc(100vh_-_400px)] overflow-y-auto">
        <SearchFormPredictive>
          {({fetchResults, goToSearch, inputRef}) => (
            <div className="flex gap-2 items-center">
              <input
                name="q"
                onChange={fetchResults}
                onFocus={fetchResults}
                placeholder={translation.search}
                ref={inputRef}
                type="search"
                className="w-full px-4 py-2 border rounded-md focus:outline-0 focus:ring-transparent"
              />
              <button
                onClick={goToSearch}
                className="px-4 py-2 bg-blueAccent text-white rounded-md opacity-90 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-indigo-700"
              >
                {translation.search}
              </button>
            </div>
          )}
        </SearchFormPredictive>

        <SearchResultsPredictive>
          {({items, total, term, state, inputRef, closeSearch}) => {
            const {articles, collections, pages, products, queries} = items;

            if (state === 'loading' && term.current) {
              return <div>{t('loading')}...</div>;
            }

            if (!total) {
              return <SearchResultsPredictive.Empty term={term} />;
            }

            return (
              <>
                <SearchResultsPredictive.Queries
                  queries={queries}
                  inputRef={inputRef}
                />
                <SearchResultsPredictive.Products
                  products={products}
                  closeSearch={closeSearch}
                  term={term}
                />
                <SearchResultsPredictive.Collections
                  collections={collections}
                  closeSearch={closeSearch}
                  term={term}
                />
                <SearchResultsPredictive.Pages
                  pages={pages}
                  closeSearch={closeSearch}
                  term={term}
                />
                <SearchResultsPredictive.Articles
                  articles={articles}
                  closeSearch={closeSearch}
                  term={term}
                />

                {term.current && total ? (
                  <Link
                    onClick={closeSearch}
                    to={`${SEARCH_ENDPOINT}?q=${term.current}`}
                    className="block text-indigo-600 hover:underline hover:text-indigo-800"
                  >
                    <p>
                      {t('View all results for')} <q>{term.current}</q> &nbsp; →
                    </p>
                  </Link>
                ) : null}
              </>
            );
          }}
        </SearchResultsPredictive>
      </div>
    </Aside>
  );
}

function MobileMenuAside({
  header,
  publicStoreDomain,
}: {
  header: PageLayoutProps['header'];
  publicStoreDomain: PageLayoutProps['publicStoreDomain'];
}) {
  return (
    header.menu &&
    header.shop.primaryDomain?.url && (
      <Aside type="mobile" heading="Меню">
        <HeaderMenu
          menu={header.menu}
          viewport="mobile"
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
        />
      </Aside>
    )
  );
}

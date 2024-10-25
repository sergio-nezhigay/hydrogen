import {Suspense} from 'react';
import {Await, NavLink} from '@remix-run/react';
import {type CartViewPayload, useAnalytics} from '@shopify/hydrogen';
import {Image} from '@shopify/hydrogen';
import {Phone} from 'lucide-react';

import {DesktopNavigationMenu} from '~/modules/DesktopNavigationMenu';
import {MobileNavigationMenu} from '~/modules/MobileNavigationMenu';
import LangSelector from '~/modules/LangSelector';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';

import {IconAccount, IconBag, IconLogin, IconSearch} from './Icon';
import {useAside} from './Aside';

const phone = {
  full: '+38(099)381-5288',
  display: '(099) 381-5288',
};

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {shop, menu} = header;

  return (
    <header className="flex sticky top-0 z-50  items-center bg-accent-gradient text-white  h-16 lg:h-[118px] ">
      <div className="flex-between container ">
        <div className="shrink-0">
          <a
            href={`tel:${phone.full}`}
            className="text-white hover:bg-stone-100/20 hidden lg:block mb-2 p-1 rounded-md xl:text-lg"
          >
            {phone.display}
          </a>
          <NavLink prefetch="intent" to="/" style={activeLinkStyle} end>
            <Image
              //  width={50}
              //  height={0}
              className="h-7 sm:h-10 md:h-14 w-auto"
              src="https://cdn.shopify.com/s/files/1/0868/0462/7772/files/byte-white.svg?v=1722326712"
              alt="logo"
              sizes="50px"
            />
          </NavLink>
        </div>

        <div className="flex flex-col gap-3 ">
          <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
          <HeaderMenu
            menu={menu}
            viewport="desktop"
            primaryDomainUrl={header.shop.primaryDomain.url}
            publicStoreDomain={publicStoreDomain}
          />
        </div>
      </div>
    </header>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  return (
    <>
      {viewport === 'mobile' && <MobileNavigationMenu />}
      {viewport === 'desktop' && <DesktopNavigationMenu />}
    </>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav className="header-ctas">
      <LangSelector />

      <a
        href={`tel:${phone.full}`}
        className="icon-header hover:bg-stone-100/20 flex items-center lg:hidden "
      >
        <Phone size={20} />
        <span className="sr-only">Телефонуйте нам {phone.display}</span>
      </a>

      <SearchToggle />
      <NavLink
        prefetch="intent"
        to="/account"
        style={activeLinkStyle}
        className="hover:bg-stone-100/20 icon-header"
      >
        <Suspense fallback=<IconLogin />>
          <Await resolve={isLoggedIn} errorElement="Sign in">
            {(isLoggedIn) => (isLoggedIn ? <IconAccount /> : <IconLogin />)}
          </Await>
        </Suspense>
      </NavLink>
      <CartToggle cart={cart} />
      <HeaderMenuMobileToggle />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button className="lg:hidden reset" onClick={() => open('mobile')}>
      <span className="icon-header hover:bg-stone-100/20 text-xl">☰</span>
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button
      className="icon-header hover:bg-stone-100/20"
      onClick={() => open('search')}
    >
      <IconSearch />
    </button>
  );
}

function CartBadge({count}: {count: number | null}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <a
      href="/cart"
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
      className="relative flex size-8 items-center justify-center focus:ring-primary/5 hover:bg-stone-100/20 rounded-md"
    >
      <>
        <IconBag />
        <div
          className="
            bg-main text-primary absolute bottom-1 right-1 flex h-3 w-auto min-w-3 items-center justify-center rounded-full px-0.5 pb-px text-center text-[0.625rem] font-medium leading-none subpixel-antialiased"
        >
          <div className="size-2">{count || 0}</div>
        </div>
      </>
    </a>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        {(cart) => {
          if (!cart) return <CartBadge count={0} />;
          return <CartBadge count={cart.totalQuantity || 0} />;
        }}
      </Await>
    </Suspense>
  );
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'white',
  };
}

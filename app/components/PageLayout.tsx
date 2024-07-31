import {useParams, Form, Await, useRouteLoaderData} from '@remix-run/react';
import useWindowScroll from 'react-use/esm/useWindowScroll';
import {Suspense, useEffect, useMemo} from 'react';
import {CartForm, Image} from '@shopify/hydrogen';

import {type LayoutQuery} from 'storefrontapi.generated';
import {Text, Section} from '~/components/Text';
import {Link} from '~/components/Link';
import {Cart} from '~/components/Cart';
import {CartLoading} from '~/components/CartLoading';
import {Input} from '~/components/Input';
import {Drawer, useDrawer} from '~/components/Drawer';

import {
  IconMenu,
  IconLogin,
  IconAccount,
  IconBag,
  IconSearch,
} from '~/components/Icon';
import {
  type EnhancedMenu,
  type ChildEnhancedMenuItem,
  useIsHomePath,
  useTranslation,
} from '~/lib/utils';
import {useIsHydrated} from '~/hooks/useIsHydrated';
import {useCartFetchers} from '~/hooks/useCartFetchers';
import type {RootLoader} from '~/root';
import {translations} from '~/data/translations';

import LangSelector from '~/modules/LangSelector';
import BreadCrumbs from '~/modules/BreadCrumbs';
import clsx from 'clsx';

type LayoutProps = {
  children: React.ReactNode;
  layout?: LayoutQuery & {
    headerMenu?: EnhancedMenu | null;
    footerMenu?: EnhancedMenu | null;
  };
  locale: keyof typeof translations;
};

export function PageLayout({children, layout, locale}: LayoutProps) {
  const {headerMenu} = layout || {};

  const logoUrl = layout?.shop.brand?.logo?.image?.url || '';

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <div className="">
          <a href="#mainContent" className="sr-only">
            Skip to content
          </a>
        </div>
        {headerMenu && layout?.shop.name && (
          <Header
            title={layout.shop.name}
            menu={headerMenu}
            logoUrl={logoUrl}
          />
        )}
        <BreadCrumbs />
        <main role="main" id="mainContent" className="grow">
          {children}
        </main>
      </div>
      <Footer locale={locale} />
    </>
  );
}

function Header({
  title,
  menu,
  logoUrl,
}: {
  title: string;
  menu?: EnhancedMenu;
  logoUrl: string;
}) {
  const isHome = useIsHomePath();

  const {
    isOpen: isCartOpen,
    openDrawer: openCart,
    closeDrawer: closeCart,
  } = useDrawer();

  const {
    isOpen: isMenuOpen,
    openDrawer: openMenu,
    closeDrawer: closeMenu,
  } = useDrawer();

  const addToCartFetchers = useCartFetchers(CartForm.ACTIONS.LinesAdd);

  // toggle cart drawer when adding to cart
  useEffect(() => {
    if (isCartOpen || !addToCartFetchers.length) return;
    openCart();
  }, [addToCartFetchers, isCartOpen, openCart]);

  return (
    <>
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
      {menu && (
        <MenuDrawer isOpen={isMenuOpen} onClose={closeMenu} menu={menu} />
      )}
      <DesktopHeader
        isHome={isHome}
        title={title}
        menu={menu}
        openCart={openCart}
        logoUrl={logoUrl}
      />
      <MobileHeader
        isHome={isHome}
        title={title}
        openCart={openCart}
        openMenu={openMenu}
        logoUrl={logoUrl}
      />
    </>
  );
}

function CartDrawer({isOpen, onClose}: {isOpen: boolean; onClose: () => void}) {
  const translation = useTranslation();
  const rootData = useRouteLoaderData<RootLoader>('root');
  if (!rootData) return null;

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      heading={translation.basket}
      openFrom="right"
    >
      <div className="grid">
        <Suspense fallback={<CartLoading />}>
          <Await resolve={rootData?.cart}>
            {(cart) => <Cart layout="drawer" onClose={onClose} cart={cart} />}
          </Await>
        </Suspense>
      </div>
    </Drawer>
  );
}

export function MenuDrawer({
  isOpen,
  onClose,
  menu,
}: {
  isOpen: boolean;
  onClose: () => void;
  menu: EnhancedMenu;
}) {
  return (
    <Drawer open={isOpen} onClose={onClose} openFrom="left" heading="Menu">
      <div className="grid">
        <MenuMobileNav menu={menu} onClose={onClose} />
      </div>
    </Drawer>
  );
}

function MenuMobileNav({
  menu,
  onClose,
}: {
  menu: EnhancedMenu;
  onClose: () => void;
}) {
  return (
    <nav className="grid gap-4 p-6 sm:gap-6 sm:px-12 sm:py-8">
      {/* Top level menu items */}
      {(menu?.items || []).map((item) => (
        <span key={item.id} className="block">
          <Link
            to={item.to}
            target={item.target}
            onClick={onClose}
            className={({isActive}) =>
              isActive ? 'pb-1 border-b -mb-px' : 'pb-1'
            }
          >
            <Text as="span" size="copy">
              {item.title}
            </Text>
          </Link>
        </span>
      ))}
    </nav>
  );
}

function MobileHeader({
  title,
  isHome,
  openCart,
  openMenu,
  logoUrl,
}: {
  title: string;
  isHome: boolean;
  openCart: () => void;
  openMenu: () => void;
  logoUrl?: string;
}) {
  // useHeaderStyleFix(containerStyle, setContainerStyle, isHome);

  const params = useParams();

  return (
    <header
      role="banner"
      className={`sticky top-0
       z-40 flex h-nav w-full items-center justify-between gap-4 bg-headerBg text-headerText px-4 md:px-8 py-6 md:py-8 leading-none backdrop-blur-lg  lg:hidden`}
    >
      <div className="flex w-full items-center justify-start gap-4">
        <button
          onClick={openMenu}
          className="relative flex size-8 items-center justify-center"
        >
          <IconMenu />
        </button>
        <Form
          method="get"
          action={params.locale ? `/${params.locale}/search` : '/search'}
          className="items-center gap-2 sm:flex"
        >
          <button
            type="submit"
            className="relative flex size-8 items-center justify-center"
          >
            <IconSearch />
          </button>
          <Input
            className={
              isHome
                ? 'focus:border-contrast/20 dark:focus:border-primary/20'
                : 'focus:border-primary/20'
            }
            type="search"
            variant="minisearch"
            placeholder="Пошук"
            name="q"
          />
        </Form>
      </div>

      {logoUrl && (
        <Link
          className="flex size-full grow items-center justify-center self-stretch leading-[3rem] md:leading-[4rem]"
          to="/"
        >
          <Image
            width={50}
            height={40}
            className="h-10 w-auto"
            src={logoUrl}
            alt="logo"
          />
        </Link>
      )}

      <div className="flex w-full items-center justify-end gap-4">
        <AccountLink className="relative flex size-8 items-center justify-center" />
        <CartCount isHome={isHome} openCart={openCart} />
      </div>
    </header>
  );
}

function DesktopHeader({
  isHome,
  menu,
  openCart,
  logoUrl,
}: {
  isHome: boolean;
  openCart: () => void;
  menu?: EnhancedMenu;
  title: string;
  logoUrl?: string;
}) {
  const params = useParams();
  const {y} = useWindowScroll();
  return (
    <header
      role="banner"
      className={`bg-headerBg text-headerText ${
        !isHome && y > 50 && ' shadow-lightHeader'
      } sticky top-0 z-40 hidden h-nav w-full items-center justify-between gap-8 leading-none backdrop-blur-lg  transition duration-300 lg:flex py-6 `}
    >
      <div className="container flex-between h-full">
        <div className="flex-center gap-12 h-full">
          {logoUrl && (
            <Link to="/" prefetch="intent" className="h-full block w-full">
              <Image
                height={95}
                width={164}
                className="object-fit w-full h-full"
                src={logoUrl}
                alt="logo"
                sizes="auto"
              />
            </Link>
          )}
          <nav className="flex gap-8">
            {/* Top level menu items */}
            {(menu?.items || []).map((item) => (
              <Link
                key={item.id}
                to={item.to}
                target={item.target}
                prefetch="viewport"
                className={({isActive}) =>
                  clsx(
                    {
                      'border-b -mb-px': isActive,
                    },
                    'pb-1 hover:border-b hover:-mb-px',
                  )
                }
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-1">
          <Form
            method="get"
            action={params.locale ? `/${params.locale}/search` : '/search'}
            className="flex items-center gap-2 group"
          >
            <Input
              className="focus:border-contrast/20 placeholder:opacity-70 group-hover:placeholder:opacity-100"
              type="search"
              variant="minisearch"
              placeholder="Пошук"
              name="q"
            />
            <button
              type="submit"
              className="relative flex size-8 items-center justify-center focus:ring-primary/5 group-hover:bg-stone-100/20 rounded-md"
            >
              <IconSearch />
            </button>
          </Form>
          <LangSelector />
          <AccountLink className="relative flex size-8 items-center justify-center focus:ring-primary/5 hover:bg-stone-100/20 rounded-md" />
          <CartCount isHome={isHome} openCart={openCart} />
        </div>
      </div>
    </header>
  );
}

function AccountLink({className}: {className?: string}) {
  const rootData = useRouteLoaderData<RootLoader>('root');
  const isLoggedIn = rootData?.isLoggedIn;

  return (
    <Link to="/account" className={className}>
      <Suspense fallback={<IconLogin />}>
        <Await resolve={isLoggedIn} errorElement={<IconLogin />}>
          {(isLoggedIn) => (isLoggedIn ? <IconAccount /> : <IconLogin />)}
        </Await>
      </Suspense>
    </Link>
  );
}

function CartCount({
  isHome,
  openCart,
}: {
  isHome: boolean;
  openCart: () => void;
}) {
  const rootData = useRouteLoaderData<RootLoader>('root');
  if (!rootData) return null;

  return (
    <Suspense fallback={<Badge count={0} dark={isHome} openCart={openCart} />}>
      <Await resolve={rootData?.cart}>
        {(cart) => (
          <Badge
            dark={isHome}
            openCart={openCart}
            count={cart?.totalQuantity || 0}
          />
        )}
      </Await>
    </Suspense>
  );
}

function Badge({
  openCart,
  dark,
  count,
}: {
  count: number;
  dark: boolean;
  openCart: () => void;
}) {
  const isHydrated = useIsHydrated();

  const BadgeCounter = useMemo(
    () => (
      <>
        <IconBag />
        <div
          className={`${
            dark
              ? 'bg-contrast text-primary dark:bg-primary dark:text-contrast'
              : 'bg-primary text-contrast'
          } absolute bottom-1 right-1 flex h-3 w-auto min-w-3 items-center justify-center rounded-full px-0.5 pb-px text-center text-[0.625rem] font-medium leading-none subpixel-antialiased`}
        >
          <span>{count || 0}</span>
        </div>
      </>
    ),
    [count, dark],
  );

  return isHydrated ? (
    <button
      onClick={openCart}
      className="relative flex size-8 items-center justify-center focus:ring-primary/5 hover:bg-stone-100/20 rounded-md"
    >
      {BadgeCounter}
    </button>
  ) : (
    <Link
      to="/cart"
      className="relative flex size-8 items-center justify-center focus:ring-primary/5"
    >
      {BadgeCounter}
    </Link>
  );
}

interface FooterProps {
  locale: keyof typeof translations;
  menu?: EnhancedMenu;
}

interface FooterItemProps {
  icon: string;
  title: string;
  content: React.ReactNode;
}

const FooterItem: React.FC<FooterItemProps> = ({icon, title, content}) => (
  <li className="grid grid-cols-[50px_1fr] items-center  whitespace-pre py-2">
    <div className="flex size-8 items-center justify-center">
      <Image
        src={icon}
        alt={title}
        className="max-h-full max-w-full"
        sizes="32px"
      />
    </div>
    <div>
      <strong>{title}:</strong>
      {content}
    </div>
  </li>
);

const Footer: React.FC<FooterProps> = ({locale}) => {
  const translation = translations[locale];
  const textColor = 'text-gray-200/80';
  const linkStyle = `${textColor} ml-2 font-bold`;

  return (
    <Section
      divider="top"
      as="footer"
      role="contentinfo"
      padding="y"
      className={`min-h-[25rem] w-full items-start overflow-hidden bg-stone-800 py-8  ${textColor}`}
    >
      <ul className="grid list-none grid-cols-1 gap-4 border-t border-gray-700 p-0">
        <FooterItem
          icon="https://cdn.shopify.com/s/files/1/0868/0462/7772/files/phone-flip-svgrepo-com_1.svg?v=1721456243"
          title={translation.phone}
          content={
            <a href="tel:+380980059236" className={linkStyle}>
              (098) 005-9236
            </a>
          }
        />
        <FooterItem
          icon="https://cdn.shopify.com/s/files/1/0868/0462/7772/files/time-svgrepo-com_1_1.svg?v=1721456153"
          title={translation.working_hours}
          content={translation.working_hours_details}
        />
        <FooterItem
          icon="https://cdn.shopify.com/s/files/1/0868/0462/7772/files/email-svgrepo-com_3.svg?v=1721455854"
          title="Email"
          content={
            <a href="mailto:info@informatica.com.ua" className={linkStyle}>
              info@informatica.com.ua
            </a>
          }
        />
        <FooterItem
          icon="https://cdn.shopify.com/s/files/1/0868/0462/7772/files/place-marker-svgrepo-com_2.svg?v=1721456036"
          title={translation.address}
          content={<span className="ml-2">{translation.address_details}</span>}
        />
      </ul>
    </Section>
  );
};

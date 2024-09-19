'use client';

import * as React from 'react';
import {Link} from '@remix-run/react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '~/components/ui/navigation-menu';
import {cn} from '~/lib/utils';

const navigationData = [
  {
    title: 'Перехідники',
    items: [
      {to: '/collections/hdmi-av', title: 'HDMI-AV'},
      {to: '/collections/splitters', title: 'Спліттери'},
      {to: '/collections/hdmi-vga', title: 'Перехідники HDMI-VGA'},
    ],
  },
  {
    title: 'Живлення',
    items: [
      {to: '/collections/power-cables', title: 'Кабелі живлення'},
      {to: '/collections/chargers', title: 'Зарядні'},
    ],
  },
  {
    title: 'Каталог',
    to: '/products',
  },
  {
    title: 'Контакти',
    to: '/pages/contact',
  },
];

export function NavigationMenuBlock() {
  return (
    <div className="text-white">
      <NavigationMenu>
        <NavigationMenuList>
          {navigationData.map((menu, index) => (
            <NavigationMenuItem key={index}>
              {menu.items ? (
                <>
                  <NavigationMenuTrigger>{menu.title}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                      {menu.items.map((item, i) => (
                        <SubMenuItem key={i} to={item.to} title={item.title} />
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </>
              ) : (
                <NavigationMenuLink asChild>
                  <Link to={menu.to} className={navigationMenuTriggerStyle()}>
                    {menu.title}
                  </Link>
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

const SubMenuItem = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link>
>(({className, title, children, ...props}, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});

SubMenuItem.displayName = 'ListItem';

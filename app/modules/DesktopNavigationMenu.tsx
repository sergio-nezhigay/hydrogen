import React from 'react';
import {Link} from '@remix-run/react';

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuViewport,
  NavigationMenuIndicator,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '~/components/ui/navigation-menu';
import {cn} from '~/lib/utils';
import {navigationData} from '~/data/navigationData';

export function DesktopNavigationMenu() {
  const [offset, setOffset] = React.useState<number | null>(null);
  const listRef = React.useRef<HTMLUListElement>(null);
  const [value, setValue] = React.useState<string | undefined>(undefined);
  const [activeTrigger, setActiveTrigger] =
    React.useState<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    const list = listRef.current;
    if (activeTrigger && list) {
      const triggerRect = activeTrigger.getBoundingClientRect();
      const listRect = list.getBoundingClientRect();

      const offsetValue =
        triggerRect.left - listRect.left + triggerRect.width / 2;

      setOffset(offsetValue < 700 ? offsetValue : 700);
    } else {
      setOffset(null);
    }
  }, [activeTrigger, value]);
  const topMenuStyle = 'font-bold xl:text-lg lg-only:px-3';

  return (
    <div className="text-white hidden lg:flex mx-auto">
      {/*<h1>offset {offset}</h1>*/}
      <NavigationMenu value={value} onValueChange={setValue}>
        <NavigationMenuList ref={listRef} className="lg-only:space-x-0">
          {navigationData.map((menu) => (
            <NavigationMenuItem key={menu.title} value={menu.title}>
              {menu.items ? (
                <>
                  <NavigationMenuTrigger
                    ref={(node) => {
                      if (menu.title === value && activeTrigger !== node) {
                        setActiveTrigger(node);
                      }
                      return node;
                    }}
                    className={topMenuStyle}
                  >
                    {menu.title}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-4 lg:w-[300px] xl:w-[600px] xl:grid-cols-2">
                      {menu.items.map((subItem) => (
                        <NavigationMenuLink key={subItem.title} asChild>
                          <Link
                            to={subItem.to}
                            className={navigationMenuTriggerStyle()}
                          >
                            {subItem.title}
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </>
              ) : (
                <NavigationMenuLink asChild>
                  <Link
                    to={menu.to}
                    className={cn(navigationMenuTriggerStyle(), topMenuStyle)}
                  >
                    {menu.title}
                  </Link>
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>
          ))}
          <NavigationMenuIndicator
            className={cn(`transition-transform duration-500 ease-in-out `, {
              hidden: offset === null,
            })}
          />
        </NavigationMenuList>

        <div className="absolute left-0 top-full w-full  flex justify-center">
          <NavigationMenuViewport
            className={cn(
              `transition-transform duration-500 ease-in-out top-full bg-main`,
              {
                hidden: offset === null,
              },
            )}
            style={{
              transform:
                offset !== null
                  ? `translateX(calc(${offset}px - var(--radix-navigation-menu-viewport-width) / 2 ))`
                  : undefined,
              width: 'var(--radix-navigation-menu-viewport-width)',
            }}
          />
        </div>
      </NavigationMenu>
    </div>
  );
}

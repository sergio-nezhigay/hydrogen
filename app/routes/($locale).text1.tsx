//import React from 'react';
//import {Link} from '@remix-run/react';

//import {
//  NavigationMenu,
//  NavigationMenuList,
//  NavigationMenuItem,
//  NavigationMenuTrigger,
//  NavigationMenuContent,
//  NavigationMenuViewport,
//  NavigationMenuIndicator,
//  NavigationMenuLink,
//} from '~/components/ui/navigation-menu';
//import {cn} from '~/lib/utils';
//import {navigationData} from '~/data/navigationData'; // Ensure this imports correctly

//export default function DesktopNavigationMenu() {
//  const [offset, setOffset] = React.useState<number | null>(null);
//  const listRef = React.useRef<HTMLUListElement>(null);
//  const [value, setValue] = React.useState<string | undefined>(undefined);
//  const [activeTrigger, setActiveTrigger] =
//    React.useState<HTMLButtonElement | null>(null);

//  // Effect to calculate offset when activeTrigger or value changes
//  React.useEffect(() => {
//    const list = listRef.current;
//    if (activeTrigger && list) {
//      const triggerRect = activeTrigger.getBoundingClientRect();
//      const listRect = list.getBoundingClientRect();

//      const offsetValue =
//        triggerRect.left - listRect.left + triggerRect.width / 2;

//      setOffset(offsetValue);
//    } else {
//      setOffset(null);
//    }
//  }, [activeTrigger, value]);

//  return (
//    <div className="text-white hidden md:flex ml-6">
//      <NavigationMenu
//        value={value}
//        onValueChange={setValue}
//        className="mx-auto"
//      >
//        <NavigationMenuList ref={listRef}>
//          {navigationData.map((menu) => (
//            <NavigationMenuItem key={menu.title} value={menu.title}>
//              {menu.items ? (
//                <>
//                  <NavigationMenuTrigger
//                    ref={(node) => {
//                      if (menu.title === value && activeTrigger !== node) {
//                        setActiveTrigger(node);
//                      }
//                      return node;
//                    }}
//                  >
//                    {menu.title}
//                  </NavigationMenuTrigger>
//                  <NavigationMenuContent>
//                    <div className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
//                      {menu.items.map((subItem) => (
//                        <NavigationMenuLink key={subItem.title} asChild>
//                          <Link
//                            to={subItem.to}
//                            className={cn('block p-2 hover:bg-gray-200')}
//                          >
//                            {subItem.title}
//                          </Link>
//                        </NavigationMenuLink>
//                      ))}
//                    </div>
//                  </NavigationMenuContent>
//                </>
//              ) : (
//                <NavigationMenuLink asChild>
//                  <Link
//                    to={menu.to}
//                    className={cn('block p-2 hover:bg-gray-200')}
//                  >
//                    {menu.title}
//                  </Link>
//                </NavigationMenuLink>
//              )}
//            </NavigationMenuItem>
//          ))}
//          <NavigationMenuIndicator />
//        </NavigationMenuList>

//        <div className="absolute left-0 top-full w-full bg-yellow-500 flex justify-center">
//          <NavigationMenuViewport
//            className={cn(
//              `transition-all duration-500 ease-in-out bg-red-200 top-full`,
//              {
//                hidden: offset === null,
//              },
//            )}
//            style={{
//              transform:
//                offset !== null
//                  ? `translateX(calc(${offset}px - var(--radix-navigation-menu-viewport-width) / 2 ))`
//                  : undefined,
//              width: 'var(--radix-navigation-menu-viewport-width)',
//            }}
//          />
//        </div>
//      </NavigationMenu>
//    </div>
//  );
//}

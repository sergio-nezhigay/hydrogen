import {Link} from '@remix-run/react';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '~/components/ui/navigation-menu';
import {topMenuItems} from '~/data/navigationData';
import {cn, useTranslation} from '~/lib/utils';

function TopMenu() {
  const {t} = useTranslation();

  return (
    <NavigationMenu className="sm-max:hidden">
      <NavigationMenuList>
        {topMenuItems.map((item) => (
          <NavigationMenuItem key={item.label}>
            <NavigationMenuLink asChild>
              <Link to={item.to} className={cn(navigationMenuTriggerStyle())}>
                {t(item.label)}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default TopMenu;

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
  const {t, language} = useTranslation();

  const langPath = `${language === 'ru' && 'ru'}`;

  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList>
        {topMenuItems.map((item) => (
          <NavigationMenuItem key={item.label}>
            <NavigationMenuLink asChild>
              <Link
                to={langPath + item.to}
                className={cn(navigationMenuTriggerStyle())}
              >
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

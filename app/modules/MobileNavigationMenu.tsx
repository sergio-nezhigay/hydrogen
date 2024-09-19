'use client';

import {Disclosure} from '@headlessui/react';
import {Link} from '@remix-run/react';
import {navigationData} from '~/data/navigationData';

interface MobileNavigationMenuProps {
  onClose?: () => void;
}

export const MobileNavigationMenu = ({onClose}: MobileNavigationMenuProps) => {
  const handleLinkClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    to: string,
  ) => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="bg-gray-100 p-4 space-y-2">
      {navigationData.map((menuGroup, index) => (
        <Disclosure key={index}>
          {({open}) => (
            <>
              {menuGroup.items ? (
                <>
                  <Disclosure.Button
                    className={`w-full text-left p-4 font-semibold transition-colors duration-200 ${
                      open ? 'bg-gray-300' : 'bg-gray-200'
                    } hover:bg-gray-300`}
                  >
                    {menuGroup.title}
                  </Disclosure.Button>
                  <Disclosure.Panel
                    className={`transition-max-height duration-500 ease-out overflow-hidden ${
                      open ? 'max-h-96' : 'max-h-0'
                    }`}
                  >
                    <ul className="pl-4 space-y-1">
                      {menuGroup.items.map((item, idx) => (
                        <li key={idx}>
                          <Link
                            to={item.to}
                            className="block p-2 text-gray-700 rounded transition-colors duration-200 hover:bg-gray-200"
                            onClick={(e) => handleLinkClick(e, item.to)}
                          >
                            {item.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </Disclosure.Panel>
                </>
              ) : (
                <Link
                  to={menuGroup.to!}
                  className="block p-4 text-gray-700 font-semibold rounded transition-colors duration-200 hover:bg-gray-200"
                  onClick={(e) => handleLinkClick(e, menuGroup.to!)}
                >
                  {menuGroup.title}
                </Link>
              )}
            </>
          )}
        </Disclosure>
      ))}
    </div>
  );
};

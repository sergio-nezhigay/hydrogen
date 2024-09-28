//'use client';

import {Disclosure} from '@headlessui/react';
import {Link} from '@remix-run/react';

import {useAside} from '~/components/Aside';
import {navigationData} from '~/data/navigationData';

export const MobileNavigationMenu = () => {
  const {close} = useAside();

  return (
    <div className="p-4 space-y-2 flex flex-col test">
      {navigationData.map((menuGroup) => (
        <Disclosure key={menuGroup.title}>
          {({open}) => (
            <>
              {menuGroup.items ? (
                <>
                  <Disclosure.Button
                    className={`w-full text-left p-4 font-bold rounded-md  transition-colors duration-200 ${
                      open ? 'bg-gray-200 ' : ''
                    } hover:bg-gray-200`}
                  >
                    {menuGroup.title}
                  </Disclosure.Button>
                  <Disclosure.Panel
                    className={`transition-max-height duration-500 ease-out overflow-hidden ${
                      open ? 'max-h-96' : 'max-h-0'
                    }`}
                  >
                    <ul className="pl-4 space-y-1">
                      {menuGroup.items.map((item) => (
                        <li key={item.title}>
                          <Link
                            to={item.to}
                            prefetch="viewport"
                            className="block p-2 text-gray-700 rounded transition-colors duration-200 hover:bg-gray-200"
                            onClick={close}
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
                  prefetch="viewport"
                  className="block p-4 text-gray-700 rounded transition-colors duration-200 hover:bg-gray-200"
                  onClick={close}
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

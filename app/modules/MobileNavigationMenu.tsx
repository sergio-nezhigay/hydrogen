import {Link} from '@remix-run/react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';
import {useAside} from '~/components/Aside';
import {navigationData, topMenuItems} from '~/data/navigationData';
import {useTranslation} from '~/lib/utils';

import LangSelector from './LangSelector';

export const MobileNavigationMenu = () => {
  const {close} = useAside();
  const {t, language} = useTranslation();

  const langPath = language === 'ru' ? 'ru' : '';

  return (
    <>
      <Accordion type="single" collapsible>
        {navigationData.map((menuGroup) => (
          <AccordionItem key={menuGroup.title} value={menuGroup.title}>
            {menuGroup.items ? (
              <>
                <AccordionTrigger
                  className={`w-full font-narrow text-left p-4 font-bold rounded-md transition-colors duration-200
                    hover:bg-gray-100
                    data-[state=open]:text-blue-700

          `}
                >
                  {t(menuGroup.title)}
                </AccordionTrigger>
                <AccordionContent
                  className={`transition-max-height duration-500 ease-out overflow-hidden `}
                >
                  <ul className="pl-4 space-y-1">
                    {menuGroup.items.map((item) => (
                      <li key={item.title}>
                        <Link
                          to={langPath + item.to}
                          prefetch="viewport"
                          className="block p-2 font-narrow text-gray-700 rounded transition-colors duration-200 hover:bg-gray-100"
                          onClick={close}
                        >
                          {t(item.title)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </>
            ) : (
              <Link
                to={langPath + menuGroup.to!}
                prefetch="viewport"
                className="block p-4 font-narrow text-gray-700 rounded transition-colors duration-200 hover:bg-gray-100"
                onClick={close}
              >
                {t(menuGroup.title)}
              </Link>
            )}
          </AccordionItem>
        ))}
      </Accordion>

      <div className="border-t mt-4 shadow-sm">
        {topMenuItems.map((item) => (
          <>
            <Link
              to={langPath + item.to}
              className="block p-4 font-narrow text-gray-700 rounded transition-colors duration-200 hover:bg-gray-100"
              onClick={close}
            >
              {t(item.label)}
            </Link>
          </>
        ))}
      </div>
    </>
  );
};

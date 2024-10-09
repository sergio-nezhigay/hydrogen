import {Link} from '@remix-run/react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';
import {useAside} from '~/components/Aside';
import {navigationData} from '~/data/navigationData';

export const MobileNavigationMenu = () => {
  const {close} = useAside();

  return (
    <Accordion type="single" collapsible>
      {navigationData.map((menuGroup) => (
        <AccordionItem key={menuGroup.title} value={menuGroup.title}>
          {menuGroup.items ? (
            <>
              <AccordionTrigger
                className={`w-full text-left p-4 font-bold rounded-md transition-colors duration-200
                    hover:bg-gray-100
                    data-[state=open]:text-blue-700

          `}
              >
                {menuGroup.title}
              </AccordionTrigger>
              <AccordionContent
                className={`transition-max-height duration-500 ease-out overflow-hidden `}
              >
                <ul className="pl-4 space-y-1">
                  {menuGroup.items.map((item) => (
                    <li key={item.title}>
                      <Link
                        to={item.to}
                        prefetch="viewport"
                        className="block p-2 text-gray-700 rounded transition-colors duration-200 hover:bg-gray-100"
                        onClick={close}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </>
          ) : (
            <Link
              to={menuGroup.to!}
              prefetch="viewport"
              className="block p-4 text-gray-700 rounded transition-colors duration-200 hover:bg-gray-100"
              onClick={close}
            >
              {menuGroup.title}
            </Link>
          )}
        </AccordionItem>
      ))}
    </Accordion>
  );
};

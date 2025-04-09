import {Link} from '~/components/Link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';
import {useAside} from '~/components/Aside';
import {navigationData, topMenuItems} from '~/data/navigationData';
import {useTranslation} from '~/lib/utils';

export const MobileNavigationMenu = () => {
  const {close} = useAside();
  const {t} = useTranslation();

  const mobileTopMenuItems = [
    ...topMenuItems,
    {to: '/account/login', label: 'Login'},
  ];

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
                          to={item.to}
                          prefetch="intent"
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
                to={menuGroup.to!}
                prefetch="intent"
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
        {mobileTopMenuItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="block p-4 font-narrow text-gray-700 rounded transition-colors duration-200 hover:bg-gray-100"
            onClick={close}
          >
            {t(item.label)}
          </Link>
        ))}
      </div>
    </>
  );
};

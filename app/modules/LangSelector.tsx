import {useLocation, useRouteLoaderData} from '@remix-run/react';

import {UkrFlag} from '~/components/Icon';
import {DEFAULT_LOCALE} from '~/lib/utils';
import type {RootLoader} from '~/root';

function LangSelector() {
  const location = useLocation();
  const currentUrl = `${location.pathname}${location.search}`;
  const rootData = useRouteLoaderData<RootLoader>('root');
  const selectedLocale = rootData?.selectedLocale ?? DEFAULT_LOCALE;
  const isUkrActive = selectedLocale.language === 'UK';

  return (
    <ul className="flex-center">
      <li className="px-2">
        {!isUkrActive ? (
          <a href={currentUrl.replace('/ru', '')} className="flex-center gap-2">
            <UkrFlag />
            UA
          </a>
        ) : (
          <span className="flex-center gap-2 text-gray-50/50">
            <UkrFlag />
            UA
          </span>
        )}
      </li>
      <li className="border-l px-2">
        {isUkrActive ? (
          <a href={'/ru' + currentUrl}>RU</a>
        ) : (
          <span className="text-gray-50/50">RU</span>
        )}
      </li>
    </ul>
  );
}

export default LangSelector;

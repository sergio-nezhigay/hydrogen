import {useLocation} from '@remix-run/react';
import clsx from 'clsx';

import {useTranslation} from '~/lib/utils';

function LangSelector() {
  const location = useLocation();
  const currentUrl = `${location.pathname}${location.search}`;

  const {language} = useTranslation();

  return (
    <ul className="hidden lg:flex-center text-base">
      <li className="px-2">
        {language === 'ru' ? (
          <a
            href={currentUrl.replace('/ru', '')}
            className="flex-center gap-2 group"
          >
            <span className="group-hover:bg-stone-100/20 icon-header">UA</span>
          </a>
        ) : (
          <span className="flex-center gap-2 text-gray-50/50">
            <span className="icon-header">UA</span>
          </span>
        )}
      </li>
      <li className="border-l pl-2">
        {language === 'uk' ? (
          <a
            href={'/ru' + currentUrl}
            className={clsx('hover:bg-stone-100/20 icon-header')}
          >
            RU
          </a>
        ) : (
          <span className={clsx('text-gray-50/50 icon-header')}>RU</span>
        )}
      </li>
    </ul>
  );
}

export default LangSelector;

import {
  Link,
  useLocation,
  useRouteLoaderData,
  useSearchParams,
  useHref 
} from '@remix-run/react';
import clsx from 'clsx';

import {DEFAULT_LOCALE} from '~/lib/utils';
import type {RootLoader} from '~/root';

function LangSelector() {
  const location = useLocation();
  console.log('🚀 ~ location:', location);
  const currentPath = location.pathname + location.search;
  const removedRuPath = currentPath.replace('/ru/', '/');
  const href = useHref("/ru"+currentPath, { relative: "route"});
  const href2 = useHref("/ru"+currentPath, { relative: "path"});
  console.log("🚀 ~ href ~ href2:", href, href2)
  console.log('🚀 ~ removedRuPath:', removedRuPath);
  console.log('🚀 ~ currentPath:', currentPath);
  const rootData = useRouteLoaderData<RootLoader>('root');
  const selectedLocale = rootData?.selectedLocale ?? DEFAULT_LOCALE;
  const isUkrActive = selectedLocale.language === 'UK';
  const isRuActive = selectedLocale.language === 'RU';
  console.log('🚀 ~ selectedLocale, isUkrActive:', selectedLocale, isUkrActive);
  return (
    <ul className="flex">
      <li>
        <span
          className={clsx('flex', {
            'text-gray-400': isUkrActive,
          })}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="256" cy="256" r="256" fill="#0057B7" />
            <path
              fill="#FFD700"
              d="M0 256c0 141.4 114.6 256 256 256s256-114.6 256-256"
            />
          </svg>
          UA
        </span>
      </li>
      <li className="border-l px-2">
        {isUkrActive ? (
          <a
            // href="https://staging1.fun/ru/"
            href={href2}
            className={clsx({
              'text-gray-400': !isUkrActive,
            })}
          >
            RU
          </a>
        ) : (
          <span>RU</span>
        )}
      </li>
    </ul>
  );
}

export default LangSelector;

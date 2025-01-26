import type {SyntheticEvent} from 'react';
import {useMemo, useState} from 'react';
import type {Location} from '@remix-run/react';
import {Check, X} from 'lucide-react';
import {
  Link,
  useLocation,
  useSearchParams,
  useNavigate,
} from '@remix-run/react';
import useDebounce from 'react-use/esm/useDebounce';
import type {
  Filter,
  ProductFilter,
} from '@shopify/hydrogen/storefront-api-types';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';
import {IconFilters, IconXMark} from '~/components/Icon';
import {cn, useTranslation} from '~/lib/utils';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '~/components/ui/dropdown-menu';
import {ScrollArea} from '~/components/ui/scroll-area';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import {navigationMenuTriggerStyle} from './ui/navigation-menu';

export type AppliedFilter = {
  label: string;
  filter: ProductFilter;
};

export type SortParam = 'price-low-high' | 'price-high-low' | 'best-selling';
//  | 'newest'
//  | 'featured';

export type SortFilterProps = {
  filters: Filter[];
  appliedFilters?: AppliedFilter[];
  children: React.ReactNode;
  collections?: Array<{handle: string; title: string}>;
};

export const FILTER_URL_PREFIX = 'filter.';

const minusBrands = ['Informatica', 'Byte', 'DSL', 'Panasonic'];

export function SortFilter({
  filters,
  appliedFilters = [],
  children,
}: SortFilterProps) {
  return (
    <>
      {/*mobile*/}
      <div className=" md:hidden">
        <div className="flex-between">
          <FiltersDrawer filters={filters} appliedFilters={appliedFilters} />
          <SortMenu />
        </div>

        <div className="flex flex-col flex-wrap md:flex-row">
          <div className="flex-1">{children}</div>
        </div>
      </div>
      {/*desktop*/}
      <div className="sm-max:hidden ">
        <div className="flex min-h-4">
          {appliedFilters.length > 0 && (
            <AppliedFilters filters={appliedFilters} />
          )}

          <div className="ml-auto relative">
            <SortMenu />
          </div>
        </div>
        <div className="flex flex-col flex-wrap md:flex-row ">
          <aside className=" min-w-full md:min-w-[240px] md:w-1/5 md:pr-8 max-h-full">
            <Filters filters={filters} appliedFilters={appliedFilters} />
          </aside>
          <div className="flex-1 md:w-4/5 ml-auto">{children}</div>
        </div>
      </div>
    </>
  );
}

function Filters({
  filters,
  appliedFilters,
}: {
  filters: Filter[];
  appliedFilters?: AppliedFilter[];
}) {
  const [params] = useSearchParams();
  const location = useLocation();
  const {t} = useTranslation();

  const sortedFilters = filters.filter(
    ({values, id}) =>
      values.some(({count}) => count > 0) || id.includes('price'),
  );

  const filterMarkup = (filter: Filter, option: Filter['values'][0]) => {
    const appliedFilter = (appliedFilters || []).find(
      (af) =>
        af.label === option.label && JSON.stringify(af.filter) === option.input,
    );

    const isActive = Boolean(appliedFilter);

    const to = getFilterLink(option.input as string, params, location);

    const appliedFilterLink = appliedFilter
      ? getAppliedFilterLink(appliedFilter, params, location)
      : undefined;

    switch (filter.type) {
      case 'PRICE_RANGE':
        const priceFilter = params.get(`${FILTER_URL_PREFIX}price`);
        const price = priceFilter
          ? (JSON.parse(priceFilter) as ProductFilter['price'])
          : undefined;
        const min = isNaN(Number(price?.min)) ? undefined : Number(price?.min);
        const max = isNaN(Number(price?.max)) ? undefined : Number(price?.max);

        return <PriceRangeFilter min={min} max={max} />;

      default:
        return (
          <Link
            prefetch="intent"
            to={isActive && appliedFilterLink ? appliedFilterLink : to}
            className={cn(
              'flex-start gap-2 w-full hover:bg-slate-100 p-1 rounded-sm group',
              {
                'bg-indigo-700/10 text-indigo-700 font-semibold': isActive,
              },
            )}
          >
            <Check
              className={cn(
                'inline-block border transition-colors shrink-0 duration-150 rounded-sm group-hover:border-stone-900 size-4 text-slate-50',
                {
                  'bg-indigo-700/80 border-indigo-700/80': isActive,
                  'bg-transparent text-transparent border-stone-900 border-opacity-50 stroke-transparent':
                    !isActive,
                },
              )}
            />

            <span className="font-narrow">{t(option.label)}</span>
          </Link>
        );
    }
  };

  return (
    <nav className="divide-y">
      <Accordion
        type="multiple"
        defaultValue={sortedFilters.map((filter) => filter.label)}
      >
        {sortedFilters.map((filter: Filter) => (
          <AccordionItem key={filter.id} value={filter.label}>
            <>
              <AccordionTrigger className="transition-colors flex justify-between w-full py-2 font-semibold font-narrow hover:text-indigo-700/80 hover:bg-transparent text-left">
                {filter.label}
              </AccordionTrigger>
              <AccordionContent key={filter.id} asChild>
                <ScrollArea className="flex flex-col max-h-80 overflow-y-auto">
                  <ul
                    key={filter.id}
                    className={cn('py-2 grid', {
                      'grid-cols-2': !filter.id.includes('price'),
                    })}
                  >
                    {filter.values
                      ?.filter(
                        ({count, id, label}) =>
                          (count > 0 || id.includes('price')) &&
                          !minusBrands.includes(label),
                      )
                      .map((option) => {
                        return (
                          <li key={option.id} className="flex pb-2">
                            {filterMarkup(filter, option)}
                          </li>
                        );
                      })}
                  </ul>
                </ScrollArea>
              </AccordionContent>
            </>
          </AccordionItem>
        ))}
      </Accordion>
    </nav>
  );
}

export function AppliedFilters({filters = []}: {filters: AppliedFilter[]}) {
  const [params] = useSearchParams();
  const location = useLocation();
  const {t} = useTranslation();

  return (
    <div className="flex items-center flex-wrap gap-2">
      {filters.map((filter: AppliedFilter) => {
        return (
          <Link
            to={getAppliedFilterLink(filter, params, location)}
            className="flex px-2 border rounded-full gap hover:bg-slate-100"
            key={filter.label}
          >
            <span className="flex-grow font-narrow">{t(filter.label)}</span>
            <span>
              <IconXMark />
            </span>
          </Link>
        );
      })}
    </div>
  );
}

function getAppliedFilterLink(
  filter: AppliedFilter,
  params: URLSearchParams,
  location: Location,
): string {
  const paramsClone = new URLSearchParams(params);

  Object.entries(filter.filter).forEach(([key, value]) => {
    const fullKey = FILTER_URL_PREFIX + key;
    if (value != null) {
      paramsClone.delete(fullKey, JSON.stringify(value));
    }
  });
  const resultUrl = `${location.pathname}?${paramsClone.toString()}`;
  return resultUrl;
}

function getSortLink(
  sort: SortParam,
  params: URLSearchParams,
  location: Location,
) {
  params.set('sort', sort);
  return `${location.pathname}?${params.toString()}`;
}

function getFilterLink(
  rawInput: string | ProductFilter,
  params: URLSearchParams,
  location: ReturnType<typeof useLocation>,
) {
  const paramsClone = new URLSearchParams(params);
  paramsClone.delete('cursor');
  paramsClone.delete('direction');
  const newParams = filterInputToParams(rawInput, paramsClone);
  return `${location.pathname}?${newParams.toString()}`;
}

const PRICE_RANGE_FILTER_DEBOUNCE = 500;

function PriceRangeFilter({max, min}: {max?: number; min?: number}) {
  const location = useLocation();

  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );

  const {translation} = useTranslation();
  const navigate = useNavigate();
  const [minPrice, setMinPrice] = useState(min);
  const [maxPrice, setMaxPrice] = useState(max);

  useDebounce(
    () => {
      if (minPrice === undefined && maxPrice === undefined) {
        params.delete(`${FILTER_URL_PREFIX}price`);
        navigate(`${location.pathname}?${params.toString()}`);
        return;
      }

      const price = {
        ...(minPrice === undefined ? {} : {min: minPrice}),
        ...(maxPrice === undefined ? {} : {max: maxPrice}),
      };
      const newParams = filterInputToParams({price}, params);
      navigate(`${location.pathname}?${newParams.toString()}`);
    },
    PRICE_RANGE_FILTER_DEBOUNCE,
    [minPrice, maxPrice],
  );

  const onChangeMax = (event: SyntheticEvent) => {
    const value = (event.target as HTMLInputElement).value;
    const newMaxPrice = Number.isNaN(parseFloat(value))
      ? undefined
      : parseFloat(value);
    setMaxPrice(newMaxPrice);
  };

  const onChangeMin = (event: SyntheticEvent) => {
    const value = (event.target as HTMLInputElement).value;
    const newMinPrice = Number.isNaN(parseFloat(value))
      ? undefined
      : parseFloat(value);
    setMinPrice(newMinPrice);
  };

  return (
    <div className="flex gap-2 mb-1">
      <label>
        <span>{translation.from}</span>
        <input
          name="minPrice"
          className="w-full"
          type="number"
          value={minPrice ?? ''}
          placeholder={'₴'}
          onChange={onChangeMin}
        />
      </label>
      <label>
        <span>{translation.to}</span>
        <input
          name="maxPrice"
          className="w-full"
          type="number"
          value={maxPrice ?? ''}
          placeholder={'₴'}
          onChange={onChangeMax}
        />
      </label>
    </div>
  );
}

function filterInputToParams(
  rawInput: string | ProductFilter,
  params: URLSearchParams,
) {
  const input =
    typeof rawInput === 'string'
      ? (JSON.parse(rawInput) as ProductFilter)
      : rawInput;

  Object.entries(input).forEach(([key, value]) => {
    if (params.has(`${FILTER_URL_PREFIX}${key}`, JSON.stringify(value))) {
      return;
    }
    if (key === 'price') {
      // For price, we want to overwrite
      params.set(`${FILTER_URL_PREFIX}${key}`, JSON.stringify(value));
    } else {
      params.append(`${FILTER_URL_PREFIX}${key}`, JSON.stringify(value));
    }
  });

  return params;
}

export default function SortMenu({className}: {className?: string}) {
  const location = useLocation();
  const navigate = useNavigate();
  const {translation} = useTranslation();

  const items: {label: string; key: SortParam}[] = [
    //{label: translation.featured, key: 'featured'},
    {
      label: translation.price_low_high ?? 'Price: Low - High',
      key: 'price-low-high',
    },
    {
      label: translation.price_high_low ?? 'Price: High - Low',
      key: 'price-high-low',
    },
    //{label: translation.best_selling ?? 'Best Selling', key: 'best-selling'},
    //{label: translation.newest ?? 'Newest', key: 'newest'},
  ];

  const [params] = useSearchParams();
  const activeItem = items.find((item) => item.key === params.get('sort'));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(navigationMenuTriggerStyle(), 'focus:bg-main border')}
      >
        {translation.sort_by}: {activeItem?.label}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="">
        {items.map((item) => (
          <DropdownMenuItem
            key={item.key}
            onClick={() => navigate(getSortLink(item.key, params, location))}
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface FiltersDrawerProps {
  filters: Filter[];
  appliedFilters?: AppliedFilter[];
}

function FiltersDrawer({filters, appliedFilters}: FiltersDrawerProps) {
  return (
    <Sheet>
      <SheetTrigger
        aria-controls={undefined}
        className="flex-center border size-10 text-black hover:bg-stone-700/5 rounded-md"
      >
        <IconFilters className="w-7 h-7 translate-x-1" />
      </SheetTrigger>

      <SheetContent side="left" className="bg-main px-2">
        <SheetHeader>
          <SheetTitle>Фільтр</SheetTitle>
          <SheetDescription className="sr-only">Фільтр</SheetDescription>
        </SheetHeader>
        <ScrollArea
          className="flex flex-col overflow-y-auto"
          style={{maxHeight: 'calc(100vh - 100px)'}}
        >
          <div className="min-h-[26px]">
            {appliedFilters && appliedFilters.length > 0 && (
              <AppliedFilters filters={appliedFilters} />
            )}
          </div>

          <Filters filters={filters} appliedFilters={appliedFilters} />
        </ScrollArea>

        <SheetClose
          asChild
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
        >
          <button type="submit">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
}

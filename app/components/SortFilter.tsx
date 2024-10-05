import type {SyntheticEvent} from 'react';
import {useMemo, useState} from 'react';
import type {Location} from '@remix-run/react';
import {Check, X} from 'lucide-react';
import {
  Link,
  useLocation,
  useSearchParams,
  useNavigate,
  useRouteLoaderData,
} from '@remix-run/react';
import useDebounce from 'react-use/esm/useDebounce';
import type {
  Filter,
  ProductFilter,
} from '@shopify/hydrogen/storefront-api-types';
import clsx from 'clsx';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';
import {Text} from '~/components/Text';
import {IconFilters, IconXMark} from '~/components/Icon';
import {cn, DEFAULT_LOCALE, sortFilters, useTranslation} from '~/lib/utils';
import type {RootLoader} from '~/root';
import {translations} from '~/data/translations';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '~/components/ui/dropdown-menu';

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

export type SortParam =
  | 'price-low-high'
  | 'price-high-low'
  | 'best-selling'
  | 'newest'
  | 'featured';

export type SortFilterProps = {
  filters: Filter[];
  appliedFilters?: AppliedFilter[];
  children: React.ReactNode;
  collections?: Array<{handle: string; title: string}>;
};

export const FILTER_URL_PREFIX = 'filter.';

export function SortFilter({
  filters,
  appliedFilters = [],
  children,
}: SortFilterProps) {
  //  const isMobile = useViewType();
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
      <div className="sm-max:hidden">
        <div className="flex min-h-9 mb-2">
          {appliedFilters.length > 0 && (
            <AppliedFilters filters={appliedFilters} />
          )}

          <div className="ml-auto relative">
            <SortMenu />
          </div>
        </div>
        <div className="flex flex-col flex-wrap md:flex-row">
          <div className="opacity-100 min-w-full md:min-w-[240px] md:w-[240px] md:pr-8 max-h-full">
            <Filters filters={filters} />
          </div>
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </>
  );
}

function Filters({filters}: {filters: Filter[]}) {
  const [params] = useSearchParams();
  const location = useLocation();
  const {t} = useTranslation();
  const sortedFilters = filters.sort((a, b) => sortFilters(a, b));

  const filterMarkup = (filter: Filter, option: Filter['values'][0]) => {
    const appliedFilter = {
      filter: JSON.parse(option.input as string),
      label: option.label,
    } as AppliedFilter;
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
        const to = getFilterLink(option.input as string, params, location);
        const isActive =
          params.toString() ===
          new URLSearchParams(to.split('?')[1]).toString();

        const appliedFilterLink = getAppliedFilterLink(
          appliedFilter,
          params,
          location,
        );

        return (
          <Link
            prefetch="intent"
            to={isActive ? appliedFilterLink : to}
            className="flex-start gap-2 hover:bg-slate-100 p-1 rounded-sm group "
          >
            <Check
              className={cn(
                'inline-block border transition-colors duration-150  rounded-sm group-hover:border-stone-900 size-4 text-slate-50  ',
                {
                  'bg-indigo-700/80 border-indigo-700/80': isActive,
                  ' border-stone-900 border-opacity-50': !isActive,
                },
              )}
            />

            <span>{t(option.label)}</span>
            <span className="opacity-60">({option.count})</span>
          </Link>
        );
    }
  };

  return (
    <>
      <nav className="md:py-4">
        <div className="divide-y">
          <Accordion
            type="multiple"
            defaultValue={sortedFilters.map((filter) => filter.label)}
          >
            {sortedFilters.map((filter: Filter) => (
              <AccordionItem key={filter.id} value={filter.label}>
                <>
                  <AccordionTrigger className="flex justify-between w-full py-2">
                    <Text
                      size="lead"
                      className="font-medium hover:text-indigo-700/70"
                    >
                      {filter.label}
                    </Text>
                  </AccordionTrigger>
                  <AccordionContent
                    key={filter.id}
                    className="max-h-[400px] overflow-y-auto"
                  >
                    <ul key={filter.id} className="py-2">
                      {filter.values
                        ?.filter(
                          ({count, id}) => count > 0 || id.includes('price'),
                        )
                        .map((option) => {
                          return (
                            <li key={option.id} className="pb-2">
                              {filterMarkup(filter, option)}
                            </li>
                          );
                        })}
                    </ul>
                  </AccordionContent>
                </>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </nav>
    </>
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
            <span className="flex-grow">{t(filter.label)}</span>
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
          className="text-black w-full"
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
          className="text-black w-full"
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
    {label: translation.featured, key: 'featured'},
    {
      label: translation.price_low_high ?? 'Price: Low - High',
      key: 'price-low-high',
    },
    {
      label: translation.price_high_low ?? 'Price: High - Low',
      key: 'price-high-low',
    },
    {label: translation.best_selling ?? 'Best Selling', key: 'best-selling'},
    {label: translation.newest ?? 'Newest', key: 'newest'},
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
        className="size-10 flex-center hover:bg-stone-700/5 rounded-md"
      >
        <IconFilters />
      </SheetTrigger>

      <SheetContent side="left" className="p-4 bg-main overflow-y-scroll ">
        <SheetHeader>
          <SheetTitle>Фільтр</SheetTitle>
          <SheetDescription className="sr-only">Фільтр</SheetDescription>
        </SheetHeader>
        <div className="">
          <div className="min-h-[26px]">
            {appliedFilters && appliedFilters.length > 0 && (
              <AppliedFilters filters={appliedFilters} />
            )}
          </div>

          <Filters filters={filters} />
        </div>

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

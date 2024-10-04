import {createContext, type ReactNode, useContext, useState} from 'react';
import {X} from 'lucide-react';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';

type AsideType = 'search' | 'cart' | 'mobile' | 'closed' | 'filter';
type AsideContextValue = {
  type: AsideType;
  open: (mode: AsideType) => void;
  close: () => void;
};

/**
 * A side bar component with Overlay
 * @example
 * ```jsx
 * <Aside type="search" heading="SEARCH">
 *  <input type="search" />
 *  ...
 * </Aside>
 * ```
 */
export function Aside({
  children,
  heading,
  type,
}: {
  children?: React.ReactNode;
  type: AsideType;
  heading: React.ReactNode;
}) {
  const {type: activeType, close} = useAside();

  return (
    <Sheet open={type === activeType}>
      <SheetContent
        className="bg-main"
        onEscapeKeyDown={close}
        onPointerDownOutside={close}
        onInteractOutside={close}
      >
        <SheetHeader>
          <SheetTitle>{heading}</SheetTitle>
          <SheetDescription className="sr-only">{heading}</SheetDescription>
        </SheetHeader>
        <div className="py-8"> {children}</div>

        <SheetClose
          asChild
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
        >
          <button type="submit" onClick={close}>
            <X className="h-4 w-4" onClick={close} />
            <span className="sr-only">Close</span>
          </button>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
}

const AsideContext = createContext<AsideContextValue | null>(null);

Aside.Provider = function AsideProvider({children}: {children: ReactNode}) {
  const [type, setType] = useState<AsideType>('closed');

  return (
    <AsideContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </AsideContext.Provider>
  );
};

export function useAside() {
  const aside = useContext(AsideContext);
  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return aside;
}

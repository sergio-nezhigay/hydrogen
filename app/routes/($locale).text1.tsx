import React from 'react';

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuViewport,
  NavigationMenuIndicator,
} from '~/components/ui/navigation-menu'; // Adjust the import based on your file structure

export default function App() {
  const [offset, setOffset] = React.useState<number | null>(null);
  const listRef = React.useRef<HTMLUListElement>(null);
  const [value, setValue] = React.useState<string | undefined>(undefined);
  const [activeTrigger, setActiveTrigger] =
    React.useState<HTMLButtonElement | null>(null);

  // Effect to calculate offset when activeTrigger or value changes
  React.useEffect(() => {
    const list = listRef.current;
    if (activeTrigger && list) {
      const triggerRect = activeTrigger.getBoundingClientRect();
      const listRect = list.getBoundingClientRect();

      // Calculate the offset based on the trigger's position
      const offsetValue = triggerRect.left - listRect.left;
      setOffset(offsetValue);
    } else {
      setOffset(null); // Reset offset if there's no active trigger or value is empty
    }
  }, [activeTrigger, value]);

  return (
    <>
      <h1>offset is {offset}</h1>{' '}
      <NavigationMenu
        value={value}
        onValueChange={setValue}
        className="mx-auto"
      >
        <NavigationMenuList ref={listRef}>
          {['one', 'two', 'three loooong', 'four', 'asdfgefg', 'f'].map(
            (item) => (
              <NavigationMenuItem key={item} value={item}>
                <NavigationMenuTrigger
                  ref={(node) => {
                    if (item === value && activeTrigger !== node) {
                      setActiveTrigger(node);
                    }
                    return node;
                  }}
                >
                  {item}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <button>{item} contentcontent</button>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ),
          )}
          <NavigationMenuIndicator />
        </NavigationMenuList>

        <div
          style={{
            position: 'absolute',
            left: 0,
            top: '100%',
            width: '100%',
            backgroundColor: 'yellow',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <NavigationMenuViewport
            style={{
              display: offset === null ? 'none' : undefined,
              transform: `translateX(${offset}px)`,
              top: '100%',
              //width: '200px',
              width: 'var(--radix-navigation-menu-viewport-width)',
              transition: 'all 0.5s ease',
              backgroundColor: 'red',
            }}
          />
        </div>
      </NavigationMenu>
    </>
  );
}

//import './styles.css';
import React from 'react';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';

export default function App() {
  const [offset, setOffset] = React.useState<number | null>(null);
  const listRef = React.useRef<HTMLUListElement>(null);
  const [value, setValue] = React.useState<string | undefined>(undefined);
  const [activeTrigger, setActiveTrigger] =
    React.useState<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    const list = listRef.current;
    if (activeTrigger && list) {
      const listWidth = list.offsetWidth;
      const listCenter = listWidth / 2;
      console.log('🚀 ~ listCenter:', listCenter);

      const triggerOffsetRight =
        listWidth -
        activeTrigger.offsetLeft -
        activeTrigger.offsetWidth +
        activeTrigger.offsetWidth / 2;
      console.log('🚀 ~   activeTrigger.offsetLeft:', activeTrigger.offsetLeft);
      console.log('🚀 ~ activeTrigger.offsetWidth:', activeTrigger.offsetWidth);
      console.log('🚀 ~ triggerOffsetRight:', triggerOffsetRight);
      setOffset(Math.round(listCenter - triggerOffsetRight));
    } else if (value === '') {
      setOffset(null);
    }
  }, [activeTrigger, value]);

  return (
    <>
      <h1>offset is {offset}</h1>{' '}
      <NavigationMenu.Root
        value={value}
        onValueChange={setValue}
        style={{
          display: 'flex',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <NavigationMenu.List
          ref={listRef}
          style={{
            display: 'flex',
            listStyle: 'none',
            margin: 0,
            marginBottom: 15,
            padding: 0,
          }}
        >
          {['one', 'two', 'three loooong', 'four', 'asdfgefg', 'f'].map(
            (item) => {
              return (
                <NavigationMenu.Item key={item} value={item}>
                  <NavigationMenu.Trigger
                    ref={(node) => {
                      if (item === value && activeTrigger !== node) {
                        setActiveTrigger(node);
                      }
                      return node;
                    }}
                  >
                    {item}
                  </NavigationMenu.Trigger>
                  <NavigationMenu.Content
                    style={{width: 100, height: 100, backgroundColor: 'red'}}
                  >
                    <button>{item} content</button>
                  </NavigationMenu.Content>
                </NavigationMenu.Item>
              );
            },
          )}

          <NavigationMenu.Indicator
            style={{
              bottom: 0,
              height: 5,
              backgroundColor: 'grey',
              transition: 'all 0.5s ease',
            }}
          />
        </NavigationMenu.List>

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
          <NavigationMenu.Viewport
            style={{
              display: !offset ? 'none' : undefined,
              transform: `translateX(${offset}px)`,
              top: '100%',
              width: 'var(--radix-navigation-menu-viewport-width)',
              transition: 'all 0.5s ease',
              backgroundColor: 'red',
            }}
          />
        </div>
      </NavigationMenu.Root>
    </>
  );
}

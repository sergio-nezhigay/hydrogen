import {Drawer, useDrawer} from './Drawer';
import {IconFilters} from './Icon';

export function Test() {
  const {
    isOpen: isFiltersOpen,
    openDrawer: openFilters,
    closeDrawer: closeFilters,
  } = useDrawer();
  return (
    <div>
      <button onClick={openFilters}>
        <IconFilters />
      </button>
      <FilterDrawer isOpen={isFiltersOpen} onClose={closeFilters} />
    </div>
  );
}

export function FilterDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      openFrom="left"
      heading="FilterWrawer"
    >
      <div>
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Similique,
          itaque?
        </p>
      </div>
    </Drawer>
  );
}

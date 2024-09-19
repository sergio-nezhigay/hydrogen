interface MenuItem {
  to: string;
  title: string;
}

type MenuGroup =
  | {
      title: string;
      items: MenuItem[];
    }
  | {
      title: string;
      to: string;
      items?: undefined;
    };

export const navigationData: MenuGroup[] = [
  {
    title: 'Перехідники',
    items: [
      {to: '/collections/hdmi-av', title: 'HDMI-AV'},
      {to: '/collections/splitters', title: 'Спліттери'},
      {to: '/collections/hdmi-vga', title: 'Перехідники HDMI-VGA'},
    ],
  },
  {
    title: 'Живлення',
    items: [
      {to: '/collections/power-cables', title: 'Кабелі живлення'},
      {to: '/collections/chargers', title: 'Зарядні'},
    ],
  },
  {
    title: 'Каталог',
    to: '/products',
  },
  {
    title: 'Контакти',
    to: '/pages/contact',
  },
];

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
    title: 'HDMI',
    items: [
      {
        title: 'HDMI-HDMI',
        to: '/collections/hdmi_cable',
      },
      {
        title: 'HDMI-DVI',
        to: '/collections/cable_hdmi_dvi',
      },
      {
        title: 'HDMI-VGA',
        to: '/collections/hdmi-vga',
      },
      {
        title: 'HDMI-RCA',
        to: '/collections/perehodnik-hdmi-rca',
      },
      {
        title: 'HDMI-DisplayPort',
        to: '/collections/kabeli-hdmi-displayport',
      },
      {
        title: 'HDMI-miniDisplayPort',
        to: '/collections/kabeli-hdmi-mini-displayport',
      },
      {
        title: 'HDMI-micro',
        to: '/collections/hdmi-micro',
      },
      {
        title: 'HDMI-mini',
        to: '/collections/hdmi-mini',
      },
      {
        title: 'HDMI-SCART',
        to: '/collections/hdmi-scart',
      },
      {
        title: 'HDMI розгалужувачі',
        to: '/collections/hdmi-splitter',
      },
    ],
  },
  {
    title: 'VGA',
    items: [
      {
        title: 'VGA-VGA',
        to: '/collections/cable_vga',
      },
      {
        title: 'VGA-HDMI',
        to: '/collections/hdmi-vga',
      },
      {
        title: 'VGA-DVI',
        to: '/collections/vga-dvi',
      },
      {
        title: 'VGA-DisplayPort',
        to: '/collections/perekhodniki-vga-displayport',
      },
      {
        title: 'VGA-miniDisplayPort',
        to: '/collections/perekhodniki-vga-mini-displayport',
      },
      {
        title: 'VGA-RCA',
        to: '/collections/vga-rca',
      },
      {
        title: 'VGA-USB',
        to: '/collections/vga-usb',
      },
      {
        title: 'VGA розгалужувачі',
        to: '/collections/vga-splitter',
      },
    ],
  },
  {
    title: 'DisplayPort',
    items: [
      {
        title: 'DisplayPort-DisplayPort',
        to: '/collections/displayport',
      },
      {
        title: 'DisplayPort-HDMI',
        to: '/collections/kabeli-hdmi-displayport',
      },
      {
        title: 'DisplayPort-DVI',
        to: '/collections/displayport-dvi',
      },
      {
        title: 'DisplayPort-VGA',
        to: '/collections/perekhodniki-vga-displayport',
      },
      {
        title: 'miniDisplayPort-DVI',
        to: '/collections/minidp-dvi',
      },
      {
        title: 'miniDisplayPort-HDMI',
        to: '/collections/kabeli-hdmi-mini-displayport',
      },
      {
        title: 'miniDisplayPort-VGA',
        to: '/collections/perekhodniki-vga-mini-displayport',
      },
    ],
  },
  {
    title: 'DVI',
    items: [
      {
        title: 'DVI-DVI',
        to: '/collections/dvi_cable',
      },
      {
        title: 'DVI-HDMI',
        to: '/collections/cable_hdmi_dvi',
      },
      {
        title: 'DVI-DisplayPort',
        to: '/collections/displayport-dvi',
      },
      {
        title: 'DVI-miniDisplayPort',
        to: '/collections/minidp-dvi',
      },
      {
        title: 'DVI-VGA',
        to: '/collections/vga-dvi',
      },
    ],
  },
  {
    title: 'RCA',
    items: [
      {
        title: 'RCA-RCA',
        to: '/collections/cabel-rca',
      },
      {
        title: 'RCA-HDMI',
        to: '/collections/perehodnik-hdmi-rca',
      },
      {
        title: 'RCA-optical',
        to: '/collections/rca-optical',
      },
      {
        title: 'RCA-3.5mm',
        to: '/collections/rca-35mm',
      },
      {
        title: 'RCA-VGA',
        to: '/collections/vga-rca',
      },
      {
        title: 'RCA-SCART',
        to: '/collections/rca-scart',
      },
    ],
  },
  {
    title: 'USB',
    items: [
      {
        title: 'USB кабелі',
        to: '/collections/kabeli-usb',
      },
      {
        title: 'USB Type C',
        to: '/collections/usb-type-c',
      },
      {
        title: 'USB-RS232',
        to: '/collections/perehonhik_com_usb',
      },
      {
        title: 'USB OTG',
        to: '/collections/usb_otg',
      },
      {
        title: 'USB flash',
        to: '/collections/fleshki',
      },

      {
        title: 'USB розгалужувачі',
        to: '/collections/koncentratory-usb',
      },
    ],
  },
  {
    title: 'Комплектуючі',
    items: [
      {
        title: 'Пам’ять оперативна',
        to: '/collections/pamyat',
      },
      {
        title: 'SSD диски',
        to: '/collections/ssd',
      },
      {
        title: 'Жорсткі диски',
        to: '/collections/hdd',
      },
      {
        title: 'Кишені для жорсткого диска',
        to: '/collections/karmany-dlja-hdd',
      },
      {
        title: 'Блоки живлення для ПК',
        to: '/collections/bloki_pitaniya',
      },
      {
        title: 'Зарядні пристрої',
        to: '/collections/power',
      },
      {
        title: 'Мережеві фільтри',
        to: '/collections/power_filters',
      },
      {
        title: 'Термопасти',
        to: '/collections/termopasta',
      },
      {
        title: 'Зовнішні акумулятори (Power Bank)',
        to: '/collections/power-bank',
      },
    ],
  },
  {
    title: 'Інше',
    items: [
      {
        title: 'Проекційні екрани',
        to: '/collections/ekran_proektora',
      },
      {
        title: 'Кронштейни для проекторів',
        to: '/collections/krepleniya-dlya-proektorov',
      },
      {
        title: 'Оптичні перехідники',
        to: '/collections/optical',
      },
      {
        title: 'Аксесуари',
        to: '/collections/other_accs',
      },
      {
        title: 'Патч кабелі',
        to: '/collections/kabeli-rj45',
      },
      {
        title: 'Кабелі інші',
        to: '/collections/cable',
      },
    ],
  },

  {
    title: 'Контакти',
    to: '/pages/contact',
  },
];

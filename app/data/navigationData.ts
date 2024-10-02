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
    title: 'Комплектуючі',
    items: [
      {to: '/collections/pamyat', title: "Пам'ять оперативна"},
      {to: '/collections/ssd', title: 'SSD диски'},
      {to: '/collections/hdd', title: 'Жорсткі диски'},
      {
        to: '/collections/karmany-dlja-hdd',
        title: 'Кишені для жорсткого диска',
      },
      {to: '/collections/cpu', title: 'Процесори'},
      {to: '/collections/termopasta', title: 'Термопасти'},
      {to: '/collections/bloki_pitaniya', title: 'Блоки живлення для ПК'},
      {
        to: '/collections/power-bank',
        title: 'Зовнішні акумулятори (Power Bank)',
      },
      {to: '/collections/power_filters', title: 'Мережеві фільтри'},
    ],
  },
  {
    title: 'Кабелі HDMI',
    items: [
      {to: '/collections/hdmi_cable', title: 'HDMI-HDMI'},
      {to: '/collections/hdmi-mini', title: 'HDMI-mini'},
      {to: '/collections/hdmi-micro', title: 'HDMI-micro'},
      {to: '/collections/kabeli-hdmi-displayport', title: 'HDMI-DisplayPort'},
      {to: '/collections/hdmi-vga', title: 'HDMI-VGA'},
      {to: '/collections/hdmi-scart', title: 'HDMI-SCART'},
      {to: '/collections/perehodnik-hdmi-rca', title: 'HDMI-RCA'},
      {
        to: '/collections/kabeli-hdmi-mini-displayport',
        title: 'HDMI-miniDisplayPort',
      },
      {to: '/collections/cable_hdmi_dvi', title: 'DVI-HDMI'},
    ],
  },
  {
    title: 'Кабелі VGA',
    items: [
      {to: '/collections/cable_vga', title: 'VGA-VGA'},
      {
        to: '/collections/perekhodniki-vga-mini-displayport',
        title: 'VGA-miniDisplayPort',
      },
      {to: '/collections/vga-rca', title: 'VGA-RCA'},
      {to: '/collections/vga-dvi', title: 'VGA-DVI'},
      {
        to: '/collections/perekhodniki-vga-displayport',
        title: 'DisplayPort-VGA',
      },
      {to: '/collections/vga-splitter', title: 'VGA розгалужувачі'},
    ],
  },
  {
    title: 'Кабелі USB',
    items: [
      {to: '/collections/kabeli-usb', title: 'USB кабелі'},
      {to: '/collections/usb_otg', title: 'USB OTG'},
      {to: '/collections/usb-type-c', title: 'USB Type C'},
      {to: '/collections/fleshki', title: 'USB flash'},
      {to: '/collections/vga-usb', title: 'USB-VGA'},
      {to: '/collections/perehonhik_com_usb', title: 'USB-RS232'},
      {to: '/collections/lpt_usb_perehodnik', title: 'USB-LPT'},
      {to: '/collections/koncentratory-usb', title: 'USB розгалужувачі'},
    ],
  },
  {
    title: 'Аксесуари та різне',
    items: [
      {to: '/collections/ekran_proektora', title: 'Проекційні екрани'},
      {
        to: '/collections/krepleniya-dlya-proektorov',
        title: 'Кронштейни для проекторів',
      },
      {to: '/collections/interaktivniye_doski', title: 'Інтерактивні дошки'},
      {to: '/collections/other_accs', title: 'Аксесуари'},
      {to: '/collections/dvi_cable', title: 'DVI-DVI'},
      {to: '/collections/displayport-dvi', title: 'DVI-DisplayPort'},
      {to: '/collections/cabel-rca', title: 'RCA-RCA'},
      {to: '/collections/rca-35mm', title: 'RCA-3.5mm'},
      {to: '/collections/rca-scart', title: 'RCA-SCART'},
      {to: '/collections/rca-optical', title: 'RCA-optical'},
      {to: '/collections/misc', title: 'Misc'},
      {to: '/collections/cable', title: 'Кабелі інші'},
      {to: '/collections/another', title: 'Різне'},
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

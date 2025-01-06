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
        title: 'HDMI Splitters',
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
        title: 'VGA Splitters',
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
        title: 'RCA-Optical',
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
        title: 'USB Cables',
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
        title: 'USB Flash',
        to: '/collections/fleshki',
      },
      {
        title: 'USB Hubs',
        to: '/collections/koncentratory-usb',
      },
    ],
  },
  {
    title: 'Components',
    items: [
      {
        title: 'RAM Memory',
        to: '/collections/pamyat',
      },
      {
        title: 'SSD Drives',
        to: '/collections/ssd',
      },
      {
        title: 'Hard Drives',
        to: '/collections/hdd',
      },
      {
        title: 'HDD Enclosures',
        to: '/collections/karmany-dlja-hdd',
      },
      {
        title: 'Mice',
        to: '/collections/mice',
      },
      {
        title: 'Keyboards',
        to: '/collections/keyboards',
      },
      {
        title: 'PC Power Supplies',
        to: '/collections/bloki_pitaniya',
      },
      {
        title: 'Thermal Paste',
        to: '/collections/termopasta',
      },
      {
        title: 'Risers',
        to: '/collections/risers',
      },
    ],
  },
  {
    title: 'Miscellaneous',
    items: [
      {
        title: 'Projector Screens',
        to: '/collections/ekran_proektora',
      },
      {
        title: 'Projector Mounts',
        to: '/collections/krepleniya-dlya-proektorov',
      },
      {
        title: 'Optical Adapters',
        to: '/collections/optical',
      },
      {
        title: 'Accessories',
        to: '/collections/other_accs',
      },
      {
        title: 'Power Banks',
        to: '/collections/power-bank',
      },
      {
        title: 'Chargers',
        to: '/collections/power',
      },
      {
        title: 'Lamps',
        to: '/collections/lamps',
      },
      {
        title: 'LED light strings',
        to: '/collections/light-strings',
      },
      {
        title: 'Laptop charger adapters',
        to: '/collections/laptop-charger-adapters',
      },
      {
        title: 'Power Filters',
        to: '/collections/power_filters',
      },
      {
        title: 'Patch Cables',
        to: '/collections/kabeli-rj45',
      },
      {
        title: 'Other Cables',
        to: '/collections/cable',
      },
    ],
  },
  //  {
  //    title: 'Contacts',
  //    to: '/pages/contact',
  //  },
];

export const topMenuItems = [
  {to: '/policies/shipping-policy', label: 'Delivery and Payment'},
  {to: '/policies/refund-policy', label: 'Warranty and returns'},
  {to: '/pages/contact', label: 'Contacts'},
];

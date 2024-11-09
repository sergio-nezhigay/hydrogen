export interface Product {
  name: string;
  imageUrl: string;
  currentPrice: string;
  oldPrice: string;
  productPageUrl: string;
  advantages: string[];
}

export const heroProducts: Product[] = [
  {
    name: 'Headphones JBL T110',
    imageUrl:
      'https://cdn.shopify.com/s/files/1/0868/0462/7772/files/naushniki-jbl-t110-black-jblt110blk_2.webp',
    currentPrice: '299грн',
    oldPrice: '450грн',
    productPageUrl:
      'naushniki-jbl-t110-black-jblt110blk?q=t110&_pos=1&_psq=t110&_ss=e&_v=1.0',
    advantages: [
      'Clear bass',
      'Button control',
      'Flat cable',
      'Microphone included',
    ],
  },
  {
    name: 'HUB USB 4-port Digitus',
    imageUrl:
      'https://cdn.shopify.com/s/files/1/0868/0462/7772/files/E910_DIGITUS_DA70216_01.webp?v=1731066065',
    currentPrice: '467грн',
    oldPrice: '620грн',
    productPageUrl: 'hub-usb-4-port-digitus-usb-20-passivnyy-belyy-da-70216',
    advantages: ['Multiple Ports', 'Compact Design', 'Easy Connectivity'],
  },
];

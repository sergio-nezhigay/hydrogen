import type {LoaderFunction} from '@shopify/remix-oxygen';

export const loader: LoaderFunction = async () => {
  const products = [
    {
      id: '1',
      title: 'Product One',
      description: 'This is the first product.',
      price: '29.99',
      currency: 'USD',
      imageUrl: 'https://example.com/image1.jpg',
    },
    {
      id: '2',
      title: 'Product Two',
      description: 'This is the second product.',
      price: '49.99',
      currency: 'USD',
      imageUrl: 'https://example.com/image2.jpg',
    },
    // Add more fixed products as needed
  ];

  // Prepare the CSV content as a string
  let csvContent = 'ID,Title,Description,Price,Currency,ImageURL\n';

  products.forEach((product) => {
    const {id, title, description, price, currency, imageUrl} = product;
    csvContent += `"${id}","${title}","${description}","${price}","${currency}","${imageUrl}"\n`;
  });

  // Encode the CSV string into a byte stream
  const csvBuffer = new TextEncoder().encode(csvContent);

  // Return the CSV response
  return new Response(csvBuffer, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="products.csv"',
    },
  });
};

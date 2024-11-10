import React from 'react';

import DynamicGallery from '~/modules/DynamicGallery';

// Example presentation component for product cards
function ProductCard({item}: {item: {name: string; price: number}}) {
  return (
    <div className="product-card">
      <h3>{item.name}</h3>
      <p>{item.price}</p>
    </div>
  );
}

const productData = [
  {name: 'Product 1', price: 100},
  {name: 'Product 2', price: 200},
];

const Test1: React.FC = () => {
  return (
    <div>
      <h1>Product Gallery</h1>
      <DynamicGallery
        data={productData}
        presentationComponent={ProductCard}
        itemStyle="my-gallery-item-style"
      />
    </div>
  );
};

export default Test1;

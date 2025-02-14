import {useCallback, useEffect, useState} from 'react';

interface VisitedProduct {
  id: string;
  handle: string;
  title: string;
  imageUrl: string;
  price: string;
}

export function useVisitedProducts(product: VisitedProduct) {
  const getVisitedProducts = useCallback(() => {
    if (typeof window === 'undefined') {
      return [];
    }
    const storedProducts = localStorage.getItem('visitedProducts');
    return storedProducts
      ? (JSON.parse(storedProducts) as VisitedProduct[])
      : [];
  }, []);

  const saveVisitedProducts = useCallback((products: VisitedProduct[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('visitedProducts', JSON.stringify(products));
    }
  }, []);

  const [visitedProducts, setVisitedProducts] = useState<VisitedProduct[]>(
    getVisitedProducts(),
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isProductAlreadyVisited = visitedProducts.some(
        (visitedProduct: VisitedProduct) => visitedProduct.id === product.id,
      );

      if (!isProductAlreadyVisited) {
        const newVisitedProducts = [
          {
            id: product.id,
            handle: product.handle,
            title: product.title,
            imageUrl: product.imageUrl,
            price: product.price,
          },
          ...visitedProducts,
        ].slice(0, 6);

        saveVisitedProducts(newVisitedProducts);
        setVisitedProducts(newVisitedProducts);
      }
    }
  }, [product, visitedProducts, saveVisitedProducts]);

  const filteredVisitedProducts = visitedProducts
    .filter(({id}) => id !== product.id)
    .map((product) => ({
      ...product,
      vendor: '',
      publishedAt: '',
      variants: {
        nodes: [
          {
            id: product.id,
            availableForSale: true,
            image: {
              url: product.imageUrl || '',
              altText: product.title,
            },
            price: {
              amount: product.price || '0',
              currencyCode: 'UAH' as const,
            },
            selectedOptions: [],
            product: {
              handle: product.handle,
              title: product.title,
            },
          },
        ],
      },
    }));

  return filteredVisitedProducts;
}

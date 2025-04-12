import {useEffect, useState} from 'react';

interface VisitedProduct {
  id: string;
  handle: string;
  title: string;
  imageUrl: string;
  price: string;
}

const LOCALSTORAGE_KEY = 'visitedProducts';
const MAX_VISITED_PRODUCTS = 6;

const getStoredVisitedProducts = (): VisitedProduct[] => {
  if (typeof window === 'undefined') return [];
  const storedProducts = localStorage.getItem(LOCALSTORAGE_KEY);
  return storedProducts ? (JSON.parse(storedProducts) as VisitedProduct[]) : [];
};

const saveVisitedProductsToStorage = (products: VisitedProduct[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(products));
  }
};

export function useVisitedProducts(product: VisitedProduct) {
  const [visitedProducts, setVisitedProducts] = useState<VisitedProduct[]>([]);

  useEffect(() => {
    const currentVisitedProducts = getStoredVisitedProducts();
    const isProductAlreadyVisited = currentVisitedProducts.some(
      (p) => p.id === product.id,
    );

    if (!isProductAlreadyVisited) {
      const newVisitedProducts = [product, ...currentVisitedProducts].slice(
        0,
        MAX_VISITED_PRODUCTS,
      );
      saveVisitedProductsToStorage(newVisitedProducts);
      setVisitedProducts(newVisitedProducts);
    } else {
      if (visitedProducts.length === 0) {
        setVisitedProducts(currentVisitedProducts);
      }
    }
  }, [product, visitedProducts.length]);

  const filteredVisitedProducts = visitedProducts
    .filter(({id}) => id !== product.id)
    .map((p) => ({
      ...p,
      vendor: '',
      publishedAt: '',
      variants: {
        nodes: [
          {
            id: p.id,
            availableForSale: true,
            image: {
              url: p.imageUrl || '',
              altText: p.title,
            },
            price: {
              amount: p.price || '0',
              currencyCode: 'UAH' as const,
            },
            selectedOptions: [],
            product: {
              handle: p.handle,
              title: p.title,
            },
          },
        ],
      },
    }));

  return filteredVisitedProducts;
}

import {useState, useEffect, useCallback} from 'react';

interface JwtHeader {
  alg: string;
  typ: string;
}

interface JwtPayload {
  exp: number;
  o: string;
  m: string;
  p: number;
  c: string;
}

export const useDiscountTokenPrice = (productId: string) => {
  const [discountedPrice, setDiscountedPrice] = useState<number | null>(null);

  const getToken = useCallback((): string | null => {
    return getTokenFromUrl() ?? getTokenFromLocalStorage();
  }, []);
  console.log('🚀 ~ discountedPrice:', discountedPrice);
  console.log('🚀 ~ productId:', productId);

  const getTokenFromUrl = (): string | null => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('pv2');
  };

  const getTokenFromLocalStorage = (): string | null => {
    return localStorage.getItem('discountToken');
  };

  const saveTokenToLocalStorage = (token: string) => {
    const currentToken = localStorage.getItem('discountToken');
    if (currentToken !== token) {
      console.log('Saving new token to localStorage:', token);
      localStorage.setItem('discountToken', token);
    }
  };

  const decodeJWT = useCallback(
    (token: string): {header: JwtHeader; payload: JwtPayload} => {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT token');
      }

      const [headerBase64, payloadBase64] = parts;
      const headerJson = decodeBase64(headerBase64);
      const payloadJson = decodeBase64(payloadBase64);

      const header: JwtHeader = JSON.parse(headerJson) as JwtHeader;
      const payload: JwtPayload = JSON.parse(payloadJson) as JwtPayload;

      if (header.alg !== 'ES256' || header.typ !== 'JWT') {
        throw new Error('Invalid token header');
      }

      return {header, payload};
    },
    [],
  );

  const decodeBase64 = (base64Url: string): string => {
    try {
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedString = atob(base64);
      return decodeURIComponent(
        decodedString
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      );
    } catch (error) {
      console.error('Base64 decoding failed:', error);
      return '';
    }
  };

  useEffect(() => {
    const isTokenValid = (payload: JwtPayload): boolean => {
      const currentTime = Math.floor(Date.now() / 1000);
      const isValid = payload.exp > currentTime && payload.o === productId;
      console.log(
        `Token validation: currentTime=${currentTime}, tokenExpiry=${payload.exp}, isValid=${isValid}, productId=${productId}, tokenProductId=${payload.o}`,
      );
      return isValid;
    };
    console.log('useDiscountToken hook initialized');
    const token = getToken();

    if (token) {
      try {
        const {header, payload} = decodeJWT(token);

        console.log('Decoded header:', header);
        console.log('Decoded payload:', payload);

        if (isTokenValid(payload)) {
          console.log('Token is valid, applying discount');
          setDiscountedPrice(parseFloat(payload.p.toFixed(2)));
          saveTokenToLocalStorage(token);
        } else {
          setDiscountedPrice(null);
          console.log('Token is invalid, cannot apply discount');
        }
      } catch (error) {
        console.error('Error decoding JWT:', error);
      }
    } else {
      console.log('No token found');
    }
  }, [decodeJWT, getToken, productId]);

  return discountedPrice ?? null;
};

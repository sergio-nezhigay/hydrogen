import {useEffect} from 'react';

export const useJwtPayload = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('pv2');
    if (token) {
      try {
        const payload = decodeJWTPayload(token);
        console.log('JWT Payload (Корисний обсяг даних):', payload);
      } catch (error) {
        console.error('Error decoding JWT:', error);
      }
    } else {
      console.log('No token found in URL');
    }
  }, []);
};

function decodeJWTPayload(token: string) {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid JWT token');
  }
  const base64Url = parts[1];

  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join(''),
  );
  return JSON.parse(jsonPayload);
}

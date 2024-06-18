import { jwtDecode } from 'jwt-decode';

export function isTokenExpired(token: string): boolean {
  if (!token) return true;

  const decodedToken: { exp: number } = jwtDecode(token);
  const expirationTime = decodedToken.exp * 1000;

  return Date.now() >= expirationTime;
}

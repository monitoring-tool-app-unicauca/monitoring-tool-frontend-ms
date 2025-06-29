export interface DecodedToken {
  sub: string;
  roles: { authority: string }[];
  iat: number;
  exp: number;
}
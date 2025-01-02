export type JWTPayload<Tctx = unknown> = {
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  nbf: number;
  iat: number;
  jti: string;
  ctx?: Tctx;
};

export type JWTString = `${string}.${string}.${string}`;

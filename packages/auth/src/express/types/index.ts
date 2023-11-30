import { ThirdwebAuth } from "../../core";
import { Json, LoginPayloadOutputSchema, User } from "../../core";
import type { GenericAuthWallet } from "@thirdweb-dev/wallets";
import { Request } from "express";
import { z } from "zod";

export const PayloadBodySchema = z.object({
  address: z.string(),
  chainId: z.string().optional(),
});

export const ActiveBodySchema = z.object({
  address: z.string(),
});

export const LoginPayloadBodySchema = z.object({
  payload: LoginPayloadOutputSchema,
});

export type ThirdwebAuthRoute = "login" | "user" | "logout";

export type ThirdwebAuthUser<
  TData extends Json = Json,
  TSession extends Json = Json,
> = User<TSession> & {
  data?: TData;
};

export type ThirdwebAuthConfig<
  TData extends Json = Json,
  TSession extends Json = Json,
> = {
  domain: string;
  wallet: GenericAuthWallet;
  authOptions?: {
    statement?: string;
    uri?: string;
    version?: string;
    chainId?: string;
    resources?: string[];
    validateNonce?:
      | ((nonce: string) => void)
      | ((nonce: string) => Promise<void>);
    validateTokenId?:
      | ((tokenId: string) => void)
      | ((tokenId: string) => Promise<void>);
    loginPayloadDurationInSeconds?: number;
    tokenDurationInSeconds?: number;
    refreshIntervalInSeconds?: number;
  };
  cookieOptions?: {
    domain?: string;
    path?: string;
    sameSite?: "lax" | "strict" | "none";
    secure?: boolean;
    tokenPrefix?: string;
    activeTokenPrefix?: string;
  };
  callbacks?: {
    onLogin?:
      | ((address: string, req: Request) => void | TSession)
      | ((address: string, req: Request) => Promise<void | TSession>);
    onToken?:
      | ((token: string, req: Request) => void)
      | ((token: string, req: Request) => Promise<void>);
    onUser?:
      | ((user: User<TSession>, req: Request) => void | TData)
      | ((user: User<TSession>, req: Request) => Promise<void | TData>);
    onLogout?:
      | ((user: User, req: Request) => void)
      | ((user: User, req: Request) => Promise<void>);
  };
};

export type ThirdwebAuthContext<
  TData extends Json = Json,
  TSession extends Json = Json,
> = Omit<Omit<ThirdwebAuthConfig<TData, TSession>, "wallet">, "domain"> & {
  auth: ThirdwebAuth;
};

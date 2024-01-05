import { Json, LoginPayloadOutputSchema, ThirdwebAuth, User } from "../../core";
import type { GenericAuthWallet } from "@thirdweb-dev/wallets";
import type { NextRequest } from "next/server";
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

export type ThirdwebAuthRoute =
  | "payload"
  | "login"
  | "logout"
  | "user"
  | "switch-account";

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
  };
  callbacks?: {
    onLogin?:
      | ((address: string, req: NextRequest) => void | TSession)
      | ((address: string, req: NextRequest) => Promise<void | TSession>);
    onToken?:
      | ((token: string, req: NextRequest) => void)
      | ((token: string, req: NextRequest) => Promise<void>);
    onUser?:
      | ((user: User<TSession>, req: NextRequest) => void | TData)
      | ((user: User<TSession>, req: NextRequest) => Promise<void | TData>);
    onLogout?:
      | ((user: User, req: NextRequest) => void)
      | ((user: User, req: NextRequest) => Promise<void>);
  };
};

export type ThirdwebAuthContext<
  TData extends Json = Json,
  TSession extends Json = Json,
> = Omit<Omit<ThirdwebAuthConfig<TData, TSession>, "wallet">, "domain"> & {
  auth: ThirdwebAuth;
};

export type NextContext = {
  params?: Record<string, string | string[]>
};

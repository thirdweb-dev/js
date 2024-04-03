import type { GenericAuthWallet } from "@thirdweb-dev/wallets";
import { z } from "zod";

import { Json, LoginPayloadOutputSchema, User } from "../../core";
import { ThirdwebAuthOptions } from "../../core/types";

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

export type ThirdwebAuthConfigShared = {
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
  thirdwebAuthOptions?: ThirdwebAuthOptions;
};

export type ThirdwebNextContext = {
  params?: Record<string, string | string[]>;
};

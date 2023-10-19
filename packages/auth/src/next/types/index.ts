import { Json, LoginPayloadOutputSchema, ThirdwebAuth, User } from "../../core";
import type { GenericAuthWallet } from "@thirdweb-dev/wallets";
import { GetServerSidePropsContext, NextApiRequest } from "next";
import { NextRequest } from "next/server";
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

type RequestType =
  | GetServerSidePropsContext["req"]
  | NextRequest
  | NextApiRequest;

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
  };
  callbacks?: {
    onLogin?:
      | ((address: string, req?: NextApiRequest) => void | TSession)
      | ((address: string, req?: NextApiRequest) => Promise<void | TSession>);
    onToken?:
      | ((token: string, req?: NextApiRequest) => void)
      | ((token: string, req?: NextApiRequest) => Promise<void>);
    onUser?:
      | (<TRequestType extends RequestType = RequestType>(
          user: User<TSession>,
          req?: TRequestType,
        ) => void | TData)
      | (<TRequestType extends RequestType = RequestType>(
          user: User<TSession>,
          req?: TRequestType,
        ) => Promise<void | TData>);
    onLogout?:
      | ((user: User, req?: NextApiRequest) => void)
      | ((user: User, req?: NextApiRequest) => Promise<void>);
  };
};

export type ThirdwebAuthContext<
  TData extends Json = Json,
  TSession extends Json = Json,
> = Omit<Omit<ThirdwebAuthConfig<TData, TSession>, "wallet">, "domain"> & {
  auth: ThirdwebAuth;
};

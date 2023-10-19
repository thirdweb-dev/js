import { GenericAuthWallet } from "@thirdweb-dev/wallets";
import { Json, LoginPayloadOutputSchema, ThirdwebAuth, User } from "../../core";
import { FastifyRequest } from "fastify";
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
      | ((address: string, req?: FastifyRequest) => void | TSession)
      | ((address: string, req?: FastifyRequest) => Promise<void | TSession>);
    onToken?:
      | ((token: string, req?: FastifyRequest) => void)
      | ((token: string, req?: FastifyRequest) => Promise<void>);
    onUser?:
      | ((user: User<TSession>, req?: FastifyRequest) => void | TData)
      | ((user: User<TSession>, req?: FastifyRequest) => Promise<void | TData>);
    onLogout?:
      | ((user: User, req?: FastifyRequest) => void)
      | ((user: User, req?: FastifyRequest) => Promise<void>);
  };
};

export type ThirdwebAuthContext<
  TData extends Json = Json,
  TSession extends Json = Json,
> = Omit<Omit<ThirdwebAuthConfig<TData, TSession>, "wallet">, "domain"> & {
  auth: ThirdwebAuth;
};

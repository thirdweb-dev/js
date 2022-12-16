import { ThirdwebAuth } from "../../core";
import {
  Json,
  LoginPayloadSchema,
  User,
  VerifyOptions,
} from "../../core/schema";
import { MinimalWallet } from "@thirdweb-dev/wallets";
import { Request } from "express";
import { z } from "zod";

export const LoginPayloadBodySchema = z.object({
  payload: LoginPayloadSchema,
});

export type ThirdwebAuthRoute = "login" | "user" | "logout";

export type ThirdwebAuthUser<TData extends Json = Json> = User & {
  data?: TData;
};

export type ThirdwebAuthConfig = {
  domain: string;
  wallet: MinimalWallet;
  verificationOptions?: Omit<Omit<VerifyOptions, "validateNonce">, "domain">;
  callbacks?: {
    login?: {
      validateNonce: (nonce: string, req?: Request) => Promise<void>;
      setUserContext: <TContext extends Json = Json>(
        address: string,
        req?: Request,
      ) => Promise<TContext>;
      onLogin: <TContext extends Json = Json>(
        user: User<TContext>,
        req?: Request,
      ) => Promise<void>;
    };
    user?: {
      validateSessionId: (sessionId: string, req?: Request) => Promise<void>;
      setUserData: <TData extends Json = Json, TContext extends Json = Json>(
        user: User<TContext>,
        req?: Request,
      ) => Promise<TData>;
    };
    logout?: {
      onLogout: (user: User, req?: Request) => Promise<void>;
    };
  };
};

export type ThirdwebAuthContext = Omit<
  Omit<ThirdwebAuthConfig, "wallet">,
  "domain"
> & {
  auth: ThirdwebAuth;
};

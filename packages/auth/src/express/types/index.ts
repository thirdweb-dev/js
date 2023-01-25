import { ThirdwebAuth } from "../../core";
import {
  AuthenticateOptions,
  Json,
  LoginPayloadOutputSchema,
  User,
  VerifyOptions,
} from "../../core/schema";
import { GenericAuthWallet } from "@thirdweb-dev/wallets";
import { Request } from "express";
import { z } from "zod";

export const LoginPayloadBodySchema = z.object({
  payload: LoginPayloadOutputSchema,
});

export type ThirdwebAuthRoute = "login" | "user" | "logout";

export type ThirdwebAuthUser<TData extends Json = Json> = User & {
  data?: TData;
};

export type ThirdwebAuthConfig = {
  domain: string;
  wallet: GenericAuthWallet;
  authOptions?: Omit<Exclude<VerifyOptions, undefined>, "domain"> &
    Omit<Exclude<AuthenticateOptions, undefined>, "domain"> & {
      tokenDurationInSeconds?: number;
    };
  cookieOptions?: {
    domain?: string;
    path?: string;
    sameSite?: "lax" | "strict" | "none";
  };
  callbacks?: {
    login?: {
      enhanceToken: <TContext extends Json = Json>(
        address: string,
        req?: Request,
      ) => Promise<TContext>;
      onLogin: <TContext extends Json = Json>(
        user: User<TContext>,
        req?: Request,
      ) => Promise<void>;
    };
    user?: {
      enhanceUser: <TData extends Json = Json, TContext extends Json = Json>(
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

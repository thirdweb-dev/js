import { ThirdwebAuth } from "../../core";
import {
  AuthenticateOptions,
  Json,
  LoginPayloadOutputSchema,
  User,
  VerifyOptions,
} from "../../core/schema";
import { GenericAuthWallet } from "@thirdweb-dev/wallets";
import { GetServerSidePropsContext, NextApiRequest } from "next";
import { NextRequest } from "next/server";
import { z } from "zod";

export const LoginPayloadBodySchema = z.object({
  payload: LoginPayloadOutputSchema,
});

type RequestType =
  | GetServerSidePropsContext["req"]
  | NextRequest
  | NextApiRequest;

export type ThirdwebAuthRoute = "login" | "logout" | "user";

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
        req?: NextApiRequest,
      ) => Promise<TContext>;
      onLogin: <TContext extends Json = Json>(
        user: User<TContext>,
        req?: NextApiRequest,
      ) => Promise<void>;
    };
    user?: {
      enhanceUser: <
        TData extends Json = Json,
        TContext extends Json = Json,
        TRequestType extends RequestType = RequestType,
      >(
        user: User<TContext>,
        req?: TRequestType,
      ) => Promise<TData>;
    };
    logout?: {
      onLogout: (user: User, req?: NextApiRequest) => Promise<void>;
    };
  };
};

export type ThirdwebAuthContext = Omit<
  Omit<ThirdwebAuthConfig, "wallet">,
  "domain"
> & {
  auth: ThirdwebAuth;
};

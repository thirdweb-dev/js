import { ThirdwebAuth } from "../../core";
import {
  Json,
  LoginPayloadOutputSchema,
  User,
  VerifyOptions,
} from "../../core/schema";
import { GenericSignerWallet } from "@thirdweb-dev/wallets";
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
  wallet: GenericSignerWallet;
  verificationOptions?: Omit<Omit<VerifyOptions, "validateNonce">, "domain">;
  callbacks?: {
    login?: {
      validateNonce: (nonce: string, req?: NextApiRequest) => Promise<void>;
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
      validateSessionId: <TRequestType extends RequestType = RequestType>(
        sessionId: string,
        req?: TRequestType,
      ) => Promise<void>;
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

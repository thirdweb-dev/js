import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { Request } from "express";

export type ThirdwebAuthRoute = "login" | "user" | "logout";

export type ThirdwebAuthConfig = {
  privateKey: string;
  domain: string;
  authUrl?: string;
  callbacks?: {
    login?: (address: string) => void;
    user?: (address: string) => ThirdwebAuthUser;
  };
};

export type ThirdwebAuthContext = {
  sdk: ThirdwebSDK;
  domain: string;
  callbacks?: {
    login?: (address: string) => void;
    user?: (address: string) => ThirdwebAuthUser;
  };
};

export type ThirdwebAuthUser = {
  address: string;
  [key: string]: any;
};

export type RequestWithUser = Request & {
  user: ThirdwebAuthUser | null;
};

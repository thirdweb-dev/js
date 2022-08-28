import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { Request } from "express";

export type ThirdwebAuthRoute = "login" | "user" | "logout";

export type ThirdwebAuthConfig = {
  privateKey: string;
  domain: string;
  authUrl?: string;
};

export type ThirdwebAuthContext = {
  sdk: ThirdwebSDK;
  domain: string;
};

export type ThirdwebAuthUser = {
  address: string;
};

export type RequestWithUser = Request & {
  user: ThirdwebAuthUser | null;
};

import { ThirdwebSDK } from "@thirdweb-dev/sdk";

export type ThirdwebAuthRoute = "login" | "logout" | "user";

export type ThirdwebAuthConfig = {
  privateKey: string;
  domain: string;
};

export type ThirdwebAuthContext = {
  sdk: ThirdwebSDK;
  domain: string;
};

export type ThirdwebAuthUser = {
  address: string;
};

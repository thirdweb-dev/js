import { ThirdwebSDK } from "@thirdweb-dev/sdk";

export type ThirdwebAuthRoute = "login" | "logout" | "user";

export type ThirdwebAuthConfig = {
  privateKey: string;
  domain: string;
  callbacks?: {
    login?: (address: string) => (Promise<void> | void);
    user?: (address: string) => (Promise<Omit<ThirdwebAuthUser, "address">> | Omit<ThirdwebAuthUser, "address">);
  };
};

export type ThirdwebAuthContext = {
  sdk: ThirdwebSDK;
  domain: string;
  callbacks?: {
    login?: (address: string) => (Promise<void> | void);
    user?: (address: string) => (Promise<Omit<ThirdwebAuthUser, "address">> | Omit<ThirdwebAuthUser, "address">);
  };
};

export type ThirdwebAuthUser = {
  address: string;
  [key: string]: any;
};

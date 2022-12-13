import { ThirdwebAuth } from "../../core";
import { MinimalWallet } from "@thirdweb-dev/wallets";

export type ThirdwebAuthRoute = "login" | "logout" | "user";

export type ThirdwebAuthConfig = {
  wallet: MinimalWallet;
  domain: string;
  callbacks?: {
    login?: (address: string) => Promise<void> | void;
    user?: (
      address: string,
    ) =>
      | Promise<Omit<ThirdwebAuthUser, "address">>
      | Omit<ThirdwebAuthUser, "address">;
  };
};

export type ThirdwebAuthContext = {
  auth: ThirdwebAuth;
  domain: string;
  callbacks?: {
    login?: (address: string) => Promise<void> | void;
    user?: (
      address: string,
    ) =>
      | Promise<Omit<ThirdwebAuthUser, "address">>
      | Omit<ThirdwebAuthUser, "address">;
  };
};

export type ThirdwebAuthUser = {
  address: string;
  [key: string]: any;
};

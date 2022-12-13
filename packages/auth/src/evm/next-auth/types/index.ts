import { MinimalWallet } from "@thirdweb-dev/wallets";
import { NextAuthOptions } from "next-auth";

export type ThirdwebNextAuthConfig = {
  domain: string;
  wallet: MinimalWallet;
  nextOptions: NextAuthOptions;
};

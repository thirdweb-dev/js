import { GenericAuthWallet } from "@thirdweb-dev/wallets";
import { NextAuthOptions } from "next-auth";

export type ThirdwebNextAuthConfig = {
  domain: string;
  wallet: GenericAuthWallet;
  nextOptions: NextAuthOptions;
};

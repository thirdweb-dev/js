import { GenericSignerWallet } from "@thirdweb-dev/wallets";
import { NextAuthOptions } from "next-auth";

export type ThirdwebNextAuthConfig = {
  domain: string;
  wallet: GenericSignerWallet;
  nextOptions: NextAuthOptions;
};

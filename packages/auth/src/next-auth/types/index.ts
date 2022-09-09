import { NextAuthOptions } from "next-auth";

export type ThirdwebNextAuthConfig = {
  privateKey: string;
  domain: string;
  nextOptions: NextAuthOptions;
};

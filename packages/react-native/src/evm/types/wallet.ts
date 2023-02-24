import { wallets } from "../constants/wallets";

export type Wallet = {
  name: string;
  homepage: string;
  chains: string[];
  versions: ('1' | '2')[];
  sdks: ('sign_v1' | 'sign_v2')[];
  image_url: {
    sm: string;
    md: string;
    lg: string;
  };
  mobile: {
    native: string;
    universal: string;
  };
};

export type SupportedWallet = keyof typeof wallets;

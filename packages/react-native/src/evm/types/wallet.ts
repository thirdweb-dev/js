import { walletsMetadata } from "../constants/walletsMetadata";

export type WalletMeta = {
  id: string;
  name: string;
  versions: ("1" | "2" | "custom")[];
  image_url: string;
  mobile: {
    native: string;
    universal: string;
  };
};

export type SupportedWallet = keyof typeof walletsMetadata;

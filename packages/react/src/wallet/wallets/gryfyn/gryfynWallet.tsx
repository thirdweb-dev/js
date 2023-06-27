import type { WalletOptions, WalletConfig } from "@thirdweb-dev/react-core";
import { GryfynWallet } from "@thirdweb-dev/wallets";

export const gryfynWallet = (options: {
  apiKey: string;
}): WalletConfig<GryfynWallet> => {
  return {
    id: "GryfynWallet",
    meta: {
      name: "Gryfyn Wallet",
      iconURL:
        "ipfs://QmTN1SvyadNdxKDy26cibRmHKLPH26C8daBZgsKFZbNVxw/gryfyn.svg",
    },
    create: (walletOptions: WalletOptions) => {
      return new GryfynWallet({ ...walletOptions, ...options });
    },
  };
};

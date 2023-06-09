import type { WalletOptions, WalletConfig } from "@thirdweb-dev/react-core";
import { GrynFynWallet } from "@thirdweb-dev/wallets";

export const gryfynWallet = (options: {
  apiKey: string;
}): WalletConfig<GrynFynWallet> => {
  return {
    id: "GrynFynWallet",
    meta: {
      name: "GrynFyn Wallet",
      iconURL:
        "ipfs://QmTN1SvyadNdxKDy26cibRmHKLPH26C8daBZgsKFZbNVxw/gryfyn.svg",
    },
    create: (walletOptions: WalletOptions) => {
      return new GrynFynWallet({ ...walletOptions, ...options });
    },
  };
};

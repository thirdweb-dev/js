import { SignerWallet, WalletOptions } from "@thirdweb-dev/wallets";
import { Signer } from "ethers";
import { WalletConfig } from "@thirdweb-dev/react-core";

export const signerWallet = (config: {
  getSigner: () => Promise<Signer>;
  meta: WalletConfig["meta"];
}): WalletConfig<SignerWallet> => {
  return {
    id: "signerWallet" + config.meta.name,
    meta: config.meta,
    create: (options: WalletOptions) =>
      new SignerWallet({
        ...options,
        getSigner: config.getSigner,
      }),
  };
};

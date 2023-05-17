import { WalletConnectV1 } from "@thirdweb-dev/wallets";
import { WalletConfig, WalletOptions } from "@thirdweb-dev/react-core";

type WalletConnectv1Options = {
  /**
   * whether to switch to `activeChain` after connecting to the wallet or just stay on the chain that wallet is already connected to
   * default - false
   * @default false
   */
  autoSwitch?: boolean;
};

export const walletConnectV1 = (
  options?: WalletConnectv1Options,
): WalletConfig<WalletConnectV1> => {
  return {
    id: WalletConnectV1.id,
    meta: WalletConnectV1.meta,
    create(walletOptions: WalletOptions) {
      return new WalletConnectV1({ ...walletOptions, qrcode: true });
    },
    autoSwitch: options?.autoSwitch,
  };
};

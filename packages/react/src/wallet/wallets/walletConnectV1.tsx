import { WalletConnectV1 } from "@thirdweb-dev/wallets";
import { WalletConfig, WalletOptions } from "@thirdweb-dev/react-core";

export const walletConnectV1 = (): WalletConfig<WalletConnectV1> => {
  return {
    id: WalletConnectV1.id,
    meta: WalletConnectV1.meta,
    create(options: WalletOptions) {
      return new WalletConnectV1({ ...options, qrcode: true });
    },
  };
};

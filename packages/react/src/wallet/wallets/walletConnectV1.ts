import { WalletConnectV1 } from "@thirdweb-dev/wallets";
import type { Wallet, WalletOptions } from "@thirdweb-dev/react-core";

export const walletConnectV1 = () => {
  return {
    id: WalletConnectV1.id,
    meta: WalletConnectV1.meta,
    create: (options: WalletOptions) =>
      new WalletConnectV1({ ...options, qrcode: true }),
  } satisfies Wallet<WalletConnectV1>;
};

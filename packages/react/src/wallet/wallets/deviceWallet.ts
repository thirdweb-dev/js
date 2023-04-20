import type { Wallet } from "@thirdweb-dev/react-core";
import { DeviceWallet, WalletOptions } from "@thirdweb-dev/wallets";

export const deviceWallet = () => {
  return {
    id: DeviceWallet.id,
    meta: DeviceWallet.meta,
    create: (options: WalletOptions) => new DeviceWallet(options),
  } satisfies Wallet;
};

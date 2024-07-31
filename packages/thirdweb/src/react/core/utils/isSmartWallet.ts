import type { Wallet } from "../../../wallets/interfaces/wallet.js";

export function hasSmartAccount(activeWallet?: Wallet): boolean {
  const config = activeWallet?.getConfig();
  return (
    !!activeWallet &&
    (activeWallet.id === "smart" ||
      (activeWallet.id === "inApp" && !!config && "smartAccount" in config))
  );
}

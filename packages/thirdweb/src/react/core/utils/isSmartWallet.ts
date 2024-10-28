import { isEcosystemWallet } from "../../../wallets/ecosystem/is-ecosystem-wallet.js";
import type { Wallet } from "../../../wallets/interfaces/wallet.js";

export function hasSmartAccount(activeWallet?: Wallet): boolean {
  const config = activeWallet?.getConfig();
  return (
    activeWallet !== undefined &&
    (activeWallet.id === "smart" ||
      (activeWallet.id === "inApp" && !!config && "smartAccount" in config) ||
      (isEcosystemWallet(activeWallet) && !!config && "smartAccount" in config))
  );
}

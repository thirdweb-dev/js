import { walletsMetadata } from "../constants/walletsMetadata";
import { SupportedWallet, WalletMeta } from "../types/wallet";

export function getWallets(supportedWallets: SupportedWallet[]): WalletMeta[] {
  return supportedWallets.map(
    (wallet) => walletsMetadata[wallet] as WalletMeta,
  );
}

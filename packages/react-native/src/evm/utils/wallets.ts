import { walletsMetadata } from "../constants/walletsMetadata";
import { WalletMeta } from "../types/walletMeta";
import { SupportedWallet } from "@thirdweb-dev/react-core";

export function getWalletsMeta(
  supportedWallets: SupportedWallet[],
): WalletMeta[] {
  return supportedWallets.map((wallet) => {
    return Object.values(walletsMetadata).find((w) =>
      wallet.name.toLowerCase().includes(w.id.toLowerCase()),
    ) as WalletMeta;
  });
}

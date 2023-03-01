import { WalletMeta } from "../types/wallet";

export function formatDisplayUri(uri: string, walletMeta: WalletMeta) {
  const encodedUri: string = encodeURIComponent(uri);
  return walletMeta.mobile.universal
    ? `${walletMeta.mobile.universal}/wc?uri=${encodedUri}`
    : walletMeta.mobile.native
    ? `${walletMeta.mobile.native}${
        walletMeta.mobile.native.endsWith(":") ? "//" : "/"
      }wc?uri=${encodedUri}`
    : `wc://${encodedUri}`;
}

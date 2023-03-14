import { WalletMeta } from "../types/wallets";

export function formatDisplayUri(uri: string, walletMeta: WalletMeta) {
  const universalLink = walletMeta.mobile.universal.includes("wc:")
    ? ""
    : walletMeta.mobile.universal;
  const nativeLink = walletMeta.mobile.native.includes("wc:")
    ? ""
    : walletMeta.mobile.native;

  const encodedUri: string = encodeURIComponent(uri);
  return universalLink
    ? `${universalLink}/wc?uri=${encodedUri}`
    : nativeLink
    ? `${nativeLink}${
        nativeLink.endsWith(":") ? "//" : "/"
      }wc?uri=${encodedUri}`
    : `${uri}`;
}

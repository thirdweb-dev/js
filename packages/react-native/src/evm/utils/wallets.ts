import { walletsMetadata } from "../constants/walletsMetadata";
import { SupportedWallet, WalletMeta } from "../types/wallet";
import { WalletConnect, WalletConnectV1 } from "@thirdweb-dev/wallets";
import invariant from "tiny-invariant";

export function getWalletsMeta(
  supportedWallets: SupportedWallet[],
): WalletMeta[] {
  return supportedWallets.map(
    (wallet) => walletsMetadata[wallet] as WalletMeta,
  );
}

export function getWalletMeta(
  classInstance: WalletConnect | WalletConnectV1,
): WalletMeta {
  console.log("getWalletMeta", classInstance.walletName);
  const walletMeta = Object.values(walletsMetadata).find((wallet) => {
    return classInstance.walletName
      .toLowerCase()
      .includes(wallet.name.toLowerCase());
  });

  invariant(walletMeta, "Wallet not found");

  return walletMeta as WalletMeta;
}

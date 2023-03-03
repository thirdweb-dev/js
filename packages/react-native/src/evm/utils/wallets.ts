import { walletsMetadata } from "../constants/walletsMetadata";
import {
  SupportedWallet as SupportedWalletMeta,
  WalletMeta,
} from "../types/wallet";
import { SupportedWallet } from "@thirdweb-dev/react-core";
import invariant from "tiny-invariant";

export function getWalletsMeta(
  supportedWallets: SupportedWalletMeta[],
): WalletMeta[] {
  return supportedWallets.map(
    (wallet) => walletsMetadata[wallet] as WalletMeta,
  );
}

export function getWalletMeta(
  classInstance: InstanceType<SupportedWallet>,
): WalletMeta {
  const walletMeta = Object.values(walletsMetadata).find((wallet) => {
    return (
      classInstance.walletName
        .toLowerCase()
        .includes(wallet.name.toLowerCase()) ||
      classInstance.walletName.toLowerCase().includes(wallet.id.toLowerCase())
    );
  });

  invariant(walletMeta, "Wallet not found");

  return walletMeta as WalletMeta;
}

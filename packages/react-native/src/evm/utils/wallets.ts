import { walletsMetadata } from "../constants/walletsMetadata";
import { WalletMeta } from "../types/wallet";
import {
  SupportedWallet,
  SupportedWalletInstance,
} from "@thirdweb-dev/react-core";
import invariant from "tiny-invariant";

export function getWalletsMeta(
  supportedWallets: SupportedWallet[],
): WalletMeta[] {
  console.log("supportedWallets", supportedWallets);
  console.log("supportedWallets[0]", supportedWallets[0].name);
  return supportedWallets.map((wallet) => {
    return Object.values(walletsMetadata).find((w) =>
      wallet.name.toLowerCase().includes(w.id.toLowerCase()),
    ) as WalletMeta;
  });
}

export function getWalletMeta(
  classInstance: SupportedWalletInstance,
): WalletMeta {
  const walletMeta = Object.values(walletsMetadata).find((wallet) => {
    return classInstance.walletId
      .toLowerCase()
      .includes(wallet.name.toLowerCase());
  });

  invariant(walletMeta, "Wallet not found");

  return walletMeta as WalletMeta;
}

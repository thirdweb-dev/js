import { LocalWalletNative } from "./LocalWallet";
import { WalletOptions, walletIds } from "@thirdweb-dev/wallets";
import { createSecureStorage } from "../../../core/SecureStorage";
import { createAsyncLocalStorage } from "../../../core/AsyncStorage";
import { LocalWalletFlow } from "../../components/ConnectWalletFlow/LocalWalletFlow";
import { ConfiguredWallet } from "@thirdweb-dev/react-core";

export const localWallet = (): ConfiguredWallet<LocalWalletNative> => {
  const secureStorage = createSecureStorage(walletIds.localWallet);
  const asyncStorage = createAsyncLocalStorage(walletIds.localWallet);

  return {
    id: LocalWalletNative.id,
    meta: LocalWalletNative.meta,
    create: (options: WalletOptions) =>
      new LocalWalletNative({
        ...options,
        walletStorage: asyncStorage,
        storage: secureStorage,
      }),
    connectUI: LocalWalletFlow,
    isInstalled() {
      // TODO
      return false;
    },
  };
};

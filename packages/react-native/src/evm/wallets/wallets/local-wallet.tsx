import { LocalWallet } from "./LocalWallet";
import { WalletOptions, walletIds } from "@thirdweb-dev/wallets";
import { createSecureStorage } from "../../../core/SecureStorage";
import { createAsyncLocalStorage } from "../../../core/AsyncStorage";
import { WalletConfig } from "@thirdweb-dev/react-core";

export const localWallet = (): WalletConfig<LocalWallet> => {
  const secureStorage = createSecureStorage(walletIds.localWallet);
  const asyncStorage = createAsyncLocalStorage(walletIds.localWallet);

  return {
    id: LocalWallet.id,
    meta: LocalWallet.meta,
    create: (options: WalletOptions) =>
      new LocalWallet({
        ...options,
        walletStorage: asyncStorage,
        storage: secureStorage,
      }),
    isInstalled() {
      // TODO
      return false;
    },
  };
};

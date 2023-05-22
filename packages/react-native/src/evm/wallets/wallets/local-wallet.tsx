import { LocalWallet } from "./LocalWallet";
import { WCMetadata, WalletOptions, walletIds } from "@thirdweb-dev/wallets";
import { createSecureStorage } from "../../../core/SecureStorage";
import {
  createAsyncLocalStorage,
  createSyncStorage,
} from "../../../core/AsyncStorage";

type LocalWalletOptions = {
  enableConnectApp?: boolean;
  wcVersion?: "v1" | "v2";
  walletConnectV2Metadata?: WCMetadata;
  walletConenctV2ProjectId?: string;
};

export const localWallet = (config?: LocalWalletOptions) => {
  const secureStorage = createSecureStorage(walletIds.localWallet);
  const asyncStorage = createAsyncLocalStorage(walletIds.localWallet);

  return {
    id: LocalWallet.id,
    meta: LocalWallet.meta,
    create: (options: WalletOptions) =>
      new LocalWallet({
        ...options,
        ...config,
        walletStorage: asyncStorage,
        storage: secureStorage,
        wcStorage: createSyncStorage("local-wallet"),
      }),
    config: {
      ...config,
    },
  };
};

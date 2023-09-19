import type { WalletConfig, WalletOptions } from "@thirdweb-dev/react-core";
import {
  SmartWallet,
  SmartWalletConfig as SmartWalletConfigWallets,
  createAsyncLocalStorage,
} from "@thirdweb-dev/wallets";
import { DEFAULT_WALLETS } from "../../constants/wallets";
import { createSyncStorage } from "../../../core/AsyncStorage";

type SmartWalletConfig = {
  personalWallets?: WalletConfig<any>[];
  recommended?: boolean;
} & Omit<SmartWalletConfigWallets, "chain" | "clientId" | "secretKey">;

export type SmartWalletObj = WalletConfig<SmartWallet>;

export const smartWallet = (
  config: SmartWalletConfig,
): WalletConfig<SmartWallet> => {
  return {
    id: SmartWallet.id,
    meta: SmartWallet.meta,
    create: (options: WalletOptions) =>
      new SmartWallet({
        ...options,
        ...config,
        walletStorage: createAsyncLocalStorage("smart-wallet"),
        wcStorage: createSyncStorage("smart-wallet"),
      }),
    personalWallets: config.personalWallets || DEFAULT_WALLETS,
    recommended: config.recommended,
  };
};

import type { Chain } from "../../chains/types.js";
import type { AsyncStorage } from "../../utils/storage/AsyncStorage.js";
import type { WalletCreationOptions, WalletId } from "../wallet-types.js";
import type { Account, Wallet } from "./wallet.js";

export type WalletData<TWalletId extends WalletId> = {
  chain: Chain | undefined;
  storage?: AsyncStorage;
  options: WalletCreationOptions<TWalletId>;
  account?: Account | undefined;
  onChainChanged: (newChainId: string) => void;
  onDisconnect: () => void;
  // dynamically loaded methods for given wallet id when doing connect/autoConnect
  methods?: {
    switchChain?: (wallet: Wallet<TWalletId>, chain: Chain) => Promise<void>;
    disconnect?: (wallet: Wallet<TWalletId>) => Promise<void>;
  };
};

const walletDataMap = new WeakMap<Wallet, WalletData<WalletId>>();

/**
 * @internal
 */
export function getWalletData<TID extends WalletId>(
  wallet: Wallet<TID>,
): WalletData<TID> | undefined {
  return walletDataMap.get(wallet) as WalletData<TID> | undefined;
}

/**
 * @internal
 */
export function setWalletData<TID extends WalletId>(
  wallet: Wallet<TID>,
  data: WalletData<TID>,
): void {
  walletDataMap.set(wallet, data as WalletData<WalletId>);
}

/**
 * @internal
 */
export function deleteWalletData<TID extends WalletId>(
  wallet: Wallet<TID>,
): void {
  walletDataMap.delete(wallet);
}

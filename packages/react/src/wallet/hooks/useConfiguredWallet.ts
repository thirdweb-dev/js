import { walletIds } from "@thirdweb-dev/wallets";
import { ConfiguredWallet, useWallets } from "@thirdweb-dev/react-core";

// TODO :may be this is not needed anymore - only used in a few places

export function useConfiguredWallet(
  id: keyof typeof walletIds,
  required: true,
): ConfiguredWallet;
export function useConfiguredWallet(
  id: keyof typeof walletIds,
  required: false,
): ConfiguredWallet | undefined;
export function useConfiguredWallet(
  id: keyof typeof walletIds,
  required: true | false,
): ConfiguredWallet | undefined {
  const wallets = useWallets();
  const found = wallets.find((w) => w.id === id);
  if (required && !found) {
    throw new Error(`Wallet ${id} not found`);
  }
  return found;
}

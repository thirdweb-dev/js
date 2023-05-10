import { useWalletContext } from "../../core/providers/thirdweb-wallet-provider";

export function useSupportedWallet(id: string) {
  const context = useWalletContext();
  const wallet = context?.wallets.find((_wallet) => _wallet.id === id);
  if (!wallet) {
    throw new Error(`Wallet with id "${id}" is not supported`);
  }
  return wallet;
}

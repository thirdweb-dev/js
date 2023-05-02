import { CoinbaseWallet } from "@thirdweb-dev/wallets";
import type { Wallet, WalletOptions } from "@thirdweb-dev/react-core";

export const coinbaseWallet = () => {
  return {
    id: CoinbaseWallet.id,
    meta: CoinbaseWallet.meta,
    create: (options: WalletOptions) =>
      new CoinbaseWallet({ ...options, headlessMode: true }),
  } satisfies Wallet<CoinbaseWallet>;
};

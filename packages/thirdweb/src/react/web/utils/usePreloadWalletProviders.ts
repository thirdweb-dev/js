import { useQueries } from "@tanstack/react-query";
import { COINBASE } from "../../../wallets/constants.js";
import { isEcosystemWallet } from "../../../wallets/ecosystem/is-ecosystem-wallet.js";
import type { Wallet } from "../../../wallets/interfaces/wallet.js";
import type { CreateWalletArgs } from "../../../wallets/wallet-types.js";

export function usePreloadWalletProviders({ wallets }: { wallets: Wallet[] }) {
  useQueries({
    queries: wallets
      .filter(
        (w) => w.id === COINBASE || w.id === "inApp" || isEcosystemWallet(w.id),
      )
      .map((w) => ({
        queryFn: async () => {
          switch (true) {
            case COINBASE === w.id: {
              const { getCoinbaseWebProvider } = await import(
                "../../../wallets/coinbase/coinbase-web.js"
              );
              await getCoinbaseWebProvider(
                w.getConfig() as CreateWalletArgs<typeof COINBASE>[1],
              );
              // return _something_
              return true;
            }
            // potentially add more wallets here
            default: {
              return false;
            }
          }
        },
        queryKey: ["preload-wallet", w.id],
      })),
  });
}

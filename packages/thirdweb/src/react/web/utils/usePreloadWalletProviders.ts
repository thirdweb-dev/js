import { useQueries } from "@tanstack/react-query";
import type { ThirdwebClient } from "../../../client/client.js";
import { COINBASE } from "../../../wallets/constants.js";
import type { Wallet } from "../../../wallets/interfaces/wallet.js";
import type { CreateWalletArgs } from "../../../wallets/wallet-types.js";

export function usePreloadWalletProviders({
  client,
  wallets,
}: { client: ThirdwebClient; wallets: Wallet[] }) {
  useQueries({
    queries: wallets
      .filter((w) => w.id === COINBASE || w.id === "inApp")
      .map((w) => ({
        queryKey: ["preload-wallet", w.id],
        queryFn: async () => {
          switch (w.id) {
            case COINBASE: {
              const { getCoinbaseWebProvider } = await import(
                "../../../wallets/coinbase/coinbaseWebSDK.js"
              );
              await getCoinbaseWebProvider(
                w.getConfig() as CreateWalletArgs<typeof COINBASE>[1],
              );
              // return _something_
              return true;
            }
            case "inApp": {
              const [
                { InAppWebConnector },
                { getOrCreateInAppWalletConnector },
              ] = await Promise.all([
                import("../../../wallets/in-app/web/lib/web-connector.js"),
                import("../../../wallets/in-app/core/wallet/in-app-core.js"),
              ]);
              await getOrCreateInAppWalletConnector(client, async (client) => {
                return new InAppWebConnector({
                  client,
                });
              });
              // return _something_
              return true;
            }
            // potentially add more wallets here
            default: {
              return false;
            }
          }
        },
      })),
  });
}

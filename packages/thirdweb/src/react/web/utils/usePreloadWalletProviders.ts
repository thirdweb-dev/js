import { useQueries } from "@tanstack/react-query";
import type { ThirdwebClient } from "../../../client/client.js";
import { COINBASE } from "../../../wallets/constants.js";
import { isEcosystemWallet } from "../../../wallets/ecosystem/is-ecosystem-wallet.js";
import type { Wallet } from "../../../wallets/interfaces/wallet.js";
import type { CreateWalletArgs } from "../../../wallets/wallet-types.js";
import type { EcosystemWalletId } from "../../../wallets/wallet-types.js";

export function usePreloadWalletProviders({
  client,
  wallets,
}: { client: ThirdwebClient; wallets: Wallet[] }) {
  useQueries({
    queries: wallets
      .filter(
        (w) => w.id === COINBASE || w.id === "inApp" || isEcosystemWallet(w.id),
      )
      .map((w) => ({
        queryKey: ["preload-wallet", w.id],
        queryFn: async () => {
          switch (true) {
            case COINBASE === w.id: {
              const { getCoinbaseWebProvider } = await import(
                "../../../wallets/coinbase/coinbaseWebSDK.js"
              );
              await getCoinbaseWebProvider(
                w.getConfig() as CreateWalletArgs<typeof COINBASE>[1],
              );
              // return _something_
              return true;
            }
            case "inApp" === w.id: {
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
            case isEcosystemWallet(w.id): {
              const [
                { InAppWebConnector },
                { getOrCreateInAppWalletConnector },
              ] = await Promise.all([
                import("../../../wallets/in-app/web/lib/web-connector.js"),
                import("../../../wallets/in-app/core/wallet/in-app-core.js"),
              ]);
              const ecosystemWallet = w as Wallet<EcosystemWalletId>; // we know this is an ecosystem wallet
              await getOrCreateInAppWalletConnector(
                client,
                async (client) => {
                  return new InAppWebConnector({
                    client,
                    ecosystem: {
                      id: ecosystemWallet.id,
                      partnerId: ecosystemWallet.getConfig()?.partnerId,
                    },
                  });
                },
                {
                  id: ecosystemWallet.id,
                  partnerId: ecosystemWallet.getConfig()?.partnerId,
                },
              );
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

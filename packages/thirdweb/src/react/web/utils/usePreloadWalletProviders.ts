import { useEffect } from "react";
import type { ThirdwebClient } from "../../../client/client.js";
import { COINBASE } from "../../../wallets/constants.js";
import type { Wallet } from "../../../wallets/interfaces/wallet.js";

export const usePreloadWalletProviders = ({
  client,
  wallets,
}: { client: ThirdwebClient; wallets: Wallet[] }) => {
  useEffect(() => {
    let active = true;

    async function run() {
      if (!active) {
        return;
      }
      // preload coinbase wallet provider
      // this is to avoid any delay on click when opening the popup window
      // which can cause the popup to be blocked by the browser
      if (wallets.map((w) => w.id).includes(COINBASE)) {
        const { getCoinbaseWebProvider } = await import(
          "../../../wallets/coinbase/coinbaseSDKWallet.js"
        );
        getCoinbaseWebProvider();
      }

      // preload inApp wallet iframe connector
      if (wallets.map((w) => w.id).includes("inApp")) {
        const [{ InAppWebConnector }, { getOrCreateInAppWalletConnector }] =
          await Promise.all([
            import("../../../wallets/in-app/web/lib/web-connector.js"),
            import("../../../wallets/in-app/core/wallet/in-app-core.js"),
          ]);
        getOrCreateInAppWalletConnector(client, async (client) => {
          return new InAppWebConnector({
            client,
          });
        });
      }
    }
    run().catch((error) => {
      console.error("failed to preload wallet provider", error);
    });
    return () => {
      active = false;
    };
  }, [wallets, client]);
};

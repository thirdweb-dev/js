import type { ThirdwebClient } from "../../../client/client.js";
import type { Wallet } from "../../interfaces/wallet.js";
import type {
  CreateWalletArgs,
  EcosystemWalletId,
} from "../../wallet-types.js";
import { createInAppWallet } from "../core/wallet/in-app-core.js";

/**
 * Creates an [Ecosystem Wallet](https://portal.thirdweb.com/connect/wallet/overview) based on various authentication methods. Full list of available authentication methods [here](/connect/wallet/sign-in-methods/configure).
 *
 * Can also be configured to use Account Abstraction to directly connect to a ERC4337 smart account based on those authentication methods.
 *
 * Refer to [inAppWallet](/typescript/v5/inAppWallet) for detailed usage examples.
 *
 * @param createOptions - configuration options
 * Refer to [EcosystemWalletCreationOptions](https://portal.thirdweb.com/references/typescript/v5/EcosystemWalletCreationOptions) for more details.
 * @returns The created ecosystem wallet.
 *
 *
 * @example
 * ### Logging into an ecosystem wallet
 *
 * Below is the general code snippet needed to connect via a given auth strategy to an ecosystem wallet. For more variants on the various auth strategies, refer to [inAppWallet](/typescript/v5/inAppWallet).
 *
 * ```ts
 * import { ecosystemWallet } from "thirdweb/wallets";
 *
 * const wallet = ecosystemWallet("ecosystem.hooli");
 *
 * const account = await wallet.connect({
 *   client,
 *   chain,
 *   strategy: "google",
 * });
 * ```
 *
 * [View all connection options](https://portal.thirdweb.com/references/typescript/v5/EcosystemWalletConnectionOptions).
 *
 * ### Connect to a restricted ecosystem wallet with your designated partner ID
 *
 * The partner ID will be provided to you by the ecosystem with which you're integrating.
 *
 * ```ts
 * import { ecosystemWallet } from "thirdweb/wallets";
 * const wallet = ecosystemWallet("ecosystem.hooli", {
 *  partnerId: "..."
 * });
 * ```
 *
 *
 * @wallet
 */
export function ecosystemWallet(
  ...args: CreateWalletArgs<EcosystemWalletId>
): Wallet<EcosystemWalletId> {
  const [ecosystemId, createOptions] = args;
  const ecosystem = {
    id: ecosystemId,
    partnerId: createOptions?.partnerId,
  };
  return createInAppWallet({
    connectorFactory: async (client: ThirdwebClient) => {
      const { InAppWebConnector } = await import("./lib/web-connector.js");
      return new InAppWebConnector({
        client,
        ecosystem,
        storage: createOptions?.storage,
      });
    },
    createOptions: {
      auth: {
        ...createOptions?.auth,
        options: [], // controlled by ecosystem
      },
      partnerId: ecosystem.partnerId,
    },
    ecosystem,
  }) as Wallet<EcosystemWalletId>;
}

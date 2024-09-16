import type { ThirdwebClient } from "../../../client/client.js";
import type { Wallet } from "../../interfaces/wallet.js";
import type {
  CreateWalletArgs,
  EcosystemWalletId,
} from "../../wallet-types.js";
import { createEcosystemWallet } from "../core/wallet/ecosystem-core.js";

/**
 * Creates an [Ecosystem Wallet](https://portal.thirdweb.com/connect/ecosystems/overview) based on various authentication methods.
 *
 * Available authentication methods:
 * - Email
 * - Phone
 * - Passkey
 * - Google
 * - Apple
 * - Facebook
 * - Discord
 * - LINE
 * - X
 * - Farcaster
 *
 * Can also be configured to use Account Abstraction to directly connect to a ERC4337 smart account based on those authentication methods.
 *
 * Refer to [inAppWallet](https://portal.thirdweb.com/references/typescript/v5/inAppWallet) for detailed usage examples.
 *
 * @param createOptions - configuration options
 * Refer to [EcosystemWalletCreationOptions](https://portal.thirdweb.com/references/typescript/v5/EcosystemWalletCreationOptions) for more details.
 * @returns The created ecosystem wallet.
 * @example
 *
 * ### Connect to an ecosystem wallet
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
 * [View all connection options](https://portal.thirdweb.com/references/typescript/v5/EcosystemWalletConnectionOptions)
 *
 * ### Connect to a restricted ecosystem wallet with your designated partner ID
 *
 * The parnter ID will be provided to you by the ecosystem with which you're integrating.
 *
 * ```ts
 * import { ecosystemWallet } from "thirdweb/wallets";
 * const wallet = ecosystemWallet("ecosystem.hooli", {
 *  partnerId: "..."
 * });
 * ```
 *
 * Refer to [inAppWallet](https://portal.thirdweb.com/references/typescript/v5/inAppWallet) for more usage examples.
 *
 * @wallet
 */
export function ecosystemWallet(
  ...args: CreateWalletArgs<EcosystemWalletId>
): Wallet<EcosystemWalletId> {
  const [ecosystemId, createOptions] = args;
  return createEcosystemWallet({
    id: ecosystemId,
    createOptions,
    connectorFactory: async (client: ThirdwebClient) => {
      const { InAppWebConnector } = await import("./lib/web-connector.js");
      return new InAppWebConnector({
        client,
        ecosystem: {
          id: ecosystemId,
          partnerId: createOptions?.partnerId,
        },
      });
    },
  });
}

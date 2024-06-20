import type { ThirdwebClient } from "../../../client/client.js";
import type { Wallet } from "../../interfaces/wallet.js";
import type {
  CreateWalletArgs,
  EcosystemWalletId,
} from "../../wallet-types.js";
import { createEcosystemWallet } from "../core/wallet/ecosystem-core.js";

/**
 * Creates an ecosystem wallet.
 * @param createOptions - configuration options
 * @returns The created ecosystem wallet.
 * @example
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
 * Enable smart accounts and sponsor gas for your users:
 * ```ts
 * import { ecosystemWallet } from "thirdweb/wallets";
 * const wallet = ecosystemWallet("ecosystem.hooli", {
 *  smartAccount: {
 *   chain: sepolia,
 *   sponsorGas: true,
 * },
 * });
 * ```
 *
 * Connect to a restricted ecosystem wallet with your designated integrator ID
 * @note The integrator ID will be provided to you by the ecosystem with which you're integrating.
 * ```ts
 * import { ecosystemWallet } from "thirdweb/wallets";
 * const wallet = ecosystemWallet("ecosystem.hooli", {
 *  integratorId: "..."
 * });
 * ```
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

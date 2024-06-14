import type { ThirdwebClient } from "../../../client/client.js";
import type { Wallet } from "../../interfaces/wallet.js";
import type { CreateWalletArgs } from "../../wallet-types.js";
import { createInAppWallet } from "../core/wallet/in-app-core.js";

/**
 * Creates an in-app wallet.
 * @param createOptions - configuration options
 * @returns The created in-app wallet.
 * @example
 * ```ts
 * import { inAppWallet } from "thirdweb/wallets";
 *
 * const wallet = inAppWallet();
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
 * import { inAppWallet } from "thirdweb/wallets";
 * const wallet = inAppWallet({
 *  smartAccount: {
 *   chain: sepolia,
 *   sponsorGas: true,
 * },
 * });
 * ```
 *
 * Specify a logo for your login page
 * ```ts
 * import { inAppWallet } from "thirdweb/wallets";
 * const wallet = inAppWallet({
 *  metadata: {
 *   image: {
 *    src: "https://example.com/logo.png",
 *    alt: "My logo",
 *    width: 100,
 *    height: 100,
 *   },
 *  },
 * });
 * ```
 *
 * Hide the ability to export the private key within the Connect Modal
 * ```ts
 * import { inAppWallet } from "thirdweb/wallets";
 * const wallet = inAppWallet({
 *  hidePrivateKeyExport: true
 * });
 * ```
 * @wallet
 */
export function inAppWallet(
  createOptions?: CreateWalletArgs<"inApp">[1],
): Wallet<"inApp"> {
  return createInAppWallet({
    createOptions,
    connectorFactory: async (client: ThirdwebClient) => {
      const { InAppNativeConnector } = await import("./native-connector.js");
      return new InAppNativeConnector({
        client,
      });
    },
  });
}

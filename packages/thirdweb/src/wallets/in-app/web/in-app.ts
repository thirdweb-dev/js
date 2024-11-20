import type { ThirdwebClient } from "../../../client/client.js";
import type { Wallet } from "../../interfaces/wallet.js";
import type { CreateWalletArgs } from "../../wallet-types.js";
import { createInAppWallet } from "../core/wallet/in-app-core.js";

/**
 * Creates an app scoped wallet for users based on various authentication methods. Full list of available authentication methods [here](https://portal.thirdweb.com/connect/wallet/sign-in-methods/overview).
 *
 * Can also be configured to use Account Abstraction to directly connect to a ERC4337 smart account based on those authentication methods.
 *
 * @param createOptions - configuration options
 * Refer to [InAppWalletCreationOptions](https://portal.thirdweb.com/references/typescript/v5/InAppWalletCreationOptions) to see the available options.
 * @returns The created in-app wallet.
 * @example
 *
 * ### Login with socials
 *
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
 * [View all available social auth methods](https://portal.thirdweb.com/connect/wallet/sign-in-methods/overview)
 *
 * ### Login with email
 *
 * ```ts
 * import { inAppWallet, preAuthenticate } from "thirdweb/wallets/in-app";
 *
 * const wallet = inAppWallet();
 *
 * // sends a verification code to the provided email
 * await preAuthenticate({
 *   client,
 *   strategy: "email",
 *   email: "example@example.com",
 * });
 *
 * // login with the verification code
 * const account = await wallet.connect({
 *   client,
 *   chain,
 *   strategy: "email",
 *   email: "example@example.com",
 *   verificationCode: "123456",
 * });
 * ```
 *
 * ### Login with SIWE
 * ```ts
 * import { inAppWallet, createWallet } from "thirdweb/wallets";
 *
 * const rabby = createWallet("io.rabby");
 * const inAppWallet = inAppWallet();
 *
 * const account = await inAppWallet.connect({
 *    strategy: "wallet",
 *    chain: mainnet,
 *    wallet: rabby,
 *    client: MY_CLIENT
 * });
 * ```
 *
 * ### Login with phone number
 * ```ts
 * import { inAppWallet, preAuthenticate } from "thirdweb/wallets/in-app";
 *
 * const wallet = inAppWallet();
 *
 * // sends a verification code to the provided phone number
 * await preAuthenticate({
 *   client,
 *   strategy: "phone",
 *   phoneNumber: "+1234567890",
 * });
 *
 * // login with the verification code
 * const account = await wallet.connect({
 *   client,
 *   chain,
 *   strategy: "phone",
 *   honeNumber: "+1234567890",
 *   verificationCode: "123456",
 * });
 * ```
 *
 * ### Login with passkey
 *
 * ```ts
 * import { inAppWallet, hasStoredPasskey } from "thirdweb/wallets/in-app";
 *
 * const wallet = inAppWallet();
 *
 * const wallet = inAppWallet();
 * const hasPasskey = await hasStoredPasskey(client);
 * await wallet.connect({
 *   client,
 *   strategy: "passkey",
 *  type: hasPasskey ? "sign-in" : "sign-up",
 * });
 * ```
 *
 * ### Enable smart accounts and sponsor gas for your users:
 *
 * ```ts
 * import { inAppWallet } from "thirdweb/wallets";
 * import { sepolia } from "thirdweb/chains";
 *
 * const wallet = inAppWallet({
 *  smartAccount: {
 *   chain: sepolia,
 *   sponsorGas: true,
 * },
 * });
 *
 * // account will be a smart account with sponsored gas enabled
 * const account = await wallet.connect({
 *   client,
 *   strategy: "google",
 * });
 * ```
 *
 * ### Connect to a guest account
 * ```ts
 * import { inAppWallet } from "thirdweb/wallets";
 *
 * const wallet = inAppWallet();
 *
 * const account = await wallet.connect({
 *   client,
 *   strategy: "guest",
 * });
 * ```
 *
 * ### Specify a logo for your login page (Connect UI)
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
 * ### Hide the ability to export the private key within the Connect Modal UI
 *
 * ```ts
 * import { inAppWallet } from "thirdweb/wallets";
 * const wallet = inAppWallet({
 *  hidePrivateKeyExport: true
 * });
 * ```
 *
 * ### Open the Oauth window in the same tab
 *
 * By default, the Oauth window will open in a popup window. You can change this behavior by setting the `auth.mode` option to `"redirect"`.
 *
 * ```ts
 * import { inAppWallet } from "thirdweb/wallets";
 * const wallet = inAppWallet({
 *  auth: {
 *    mode: "redirect"
 *  }
 * });
 * ```
 *
 * @returns The created in-app wallet.
 * @wallet
 */
export function inAppWallet(
  createOptions?: CreateWalletArgs<"inApp">[1],
): Wallet<"inApp"> {
  return createInAppWallet({
    createOptions,
    connectorFactory: async (client: ThirdwebClient) => {
      const { InAppWebConnector } = await import("./lib/web-connector.js");
      return new InAppWebConnector({
        client,
        passkeyDomain: createOptions?.auth?.passkeyDomain,
      });
    },
  }) as Wallet<"inApp">;
}

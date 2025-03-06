import type { ThirdwebClient } from "../../../client/client.js";
import type { Wallet } from "../../interfaces/wallet.js";
import type { CreateWalletArgs } from "../../wallet-types.js";
import { createInAppWallet } from "../core/wallet/in-app-core.js";

/**
 * Creates an app scoped wallet for users based on various authentication methods. Full list of available authentication methods [here](https://portal.thirdweb.com/connect/wallet/sign-in-methods/configure).
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
 * [View all available social auth methods](https://portal.thirdweb.com/connect/wallet/sign-in-methods/configure)
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
 * ### Connect to a backend account
 *
 * ```ts
 * import { inAppWallet } from "thirdweb/wallets";
 *
 * const wallet = inAppWallet();
 *
 * const account = await wallet.connect({
 *   client,
 *   strategy: "backend",
 *   walletSecret: "...", // Provided by your app
 * });
 * ```
 *
 * ### Connect with custom JWT (any OIDC provider)
 *
 * You can use any OIDC provider to authenticate your users. Make sure to configure it in your dashboard under in-app wallet settings.
 *
 * ```ts
 * import { inAppWallet } from "thirdweb/wallets";
 *
 * const wallet = inAppWallet();
 *
 * const account = await wallet.connect({
 *   client,
 *   strategy: "jwt",
 *   jwt: "your_jwt_here",
 * });
 * ```
 *
 * ### Connect with custom endpoint
 *
 * You can also use your own endpoint to authenticate your users. Make sure to configure it in your dashboard under in-app wallet settings.
 *
 * ```ts
 * import { inAppWallet } from "thirdweb/wallets";
 *
 * const wallet = inAppWallet();
 *
 * const account = await wallet.connect({
 *   client,
 *   strategy: "auth_endpoint",
 *   payload: "your_auth_payload_here",
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
 * ### Override storage for the wallet state
 *
 * By default, wallet state is stored in the browser's local storage. You can override this behavior by providing a custom storage object, useful for server side integrations.
 *
 * ```ts
 * import { inAppWallet } from "thirdweb/wallets";
 * import { AsyncStorage } from "thirdweb/storage";
 *
 * const myStorage: AsyncStorage = {
 *  getItem: async (key) => {
 *    return customGet(`CUSTOM_STORAGE_KEY${key}`);
 *  },
 *  setItem: async (key, value) => {
 *    return customSet(`CUSTOM_STORAGE_KEY${key}`, value);
 *  },
 *  removeItem: async (key) => {
 *    return customRemove(`CUSTOM_STORAGE_KEY${key}`);
 *  },
 * };
 *
 * const wallet = inAppWallet({
 *  storage: myStorage,
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
        storage: createOptions?.storage,
      });
    },
  }) as Wallet<"inApp">;
}

import type { ThirdwebClient } from "../../../client/client.js";
import type { Wallet } from "../../interfaces/wallet.js";
import { createInAppWallet } from "../core/wallet/in-app-core.js";
import type { InAppWalletCreationOptions } from "../core/wallet/types.js";

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
 *   strategy: "google", // or "apple", "facebook","discord", "github", "twitch", "x", "telegram", "line", "coinbase", etc
 * });
 * ```
 *
 * [View all available social auth methods](https://portal.thirdweb.com/connect/wallet/sign-in-methods/configure)
 *
 * ### Enable smart accounts and sponsor gas for your users:
 *
 * With the `executionMode` option, you can enable smart accounts and sponsor gas for your users.
 *
 * **Using EIP-7702** (recommended):
 *
 * On chains with EIP-7702 enabled, you can upgrade the inapp wallet to a smart account, keeping the same address and performance as the regular EOA.
 *
 * ```ts
 * import { inAppWallet } from "thirdweb/wallets";
 * import { sepolia } from "thirdweb/chains";
 *
 * const wallet = inAppWallet({
 *  executionMode: {
 *   mode: "EIP7702",
 *   sponsorGas: true,
 *  },
 * });
 *
 * // account will be a smart account with sponsored gas enabled
 * const account = await wallet.connect({
 *   client,
 *   strategy: "google",
 * });
 * ```
 *
 * **Using EIP-4337**:
 *
 * On chains without EIP-7702 enabled, you can still use smart accounts using EIP-4337, this will return a different address (the smart contract address) than the regular EOA.
 *
 * ```ts
 * import { inAppWallet } from "thirdweb/wallets/in-app";
 *
 * const wallet = inAppWallet({
 *  executionMode: {
 *   mode: "EIP4337",
 *   smartAccount: {
 *    chain: sepolia, // chain required for EIP-4337
 *    sponsorGas: true,
 *   }
 *  },
 * });
 * ```
 *
 * ### Login with email
 *
 * To login with email, you can use the `preAuthenticate` function to first send a verification code to the user's email, then login with the verification code.
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
 * ### Login with phone number
 *
 * Similar to email, you can login with a phone number by first sending a verification code to the user's phone number, then login with the verification code.
 *
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
 * ### Login with another wallet (SIWE)
 *
 * You can also login to the in-app wallet with another existing wallet by signing a standard Sign in with Ethereum (SIWE) message.
 *
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
 * ### Login with passkey
 *
 * You can also login with a passkey. This mode requires specifying whether it should create a new passkey, or sign in with an existing passkey. We recommend checking if the user has a passkey stored in their browser to automatically login with it.
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
 *
 * You can also connect to a guest account, this will create a new account for the user instantly and store it in the browser's local storage.
 *
 * You can later "upgrade" this account by linking another auth method, like email or phone for example. This will preserve the account's address and history.
 *
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
 * For usage in backends, you can create wallets with the `backend` strategy and a stable walletSecret.
 *
 * Make sure to keep that walletSecret safe as it is the key to access that wallet, never expose it to the client.
 *
 * ```ts
 * import { inAppWallet } from "thirdweb/wallets";
 *
 * const wallet = inAppWallet();
 *
 * const account = await wallet.connect({
 *   client,
 *   strategy: "backend",
 *   walletSecret: "...", // Your own secret, keep it safe
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
 * ### Specify a logo, icon and name for your login page (Connect UI)
 *
 * You can specify a logo, icon and name for your login page to customize how in-app wallets are displayed in the Connect UI components (ConnectButton and ConnectEmbed).
 *
 * ```ts
 * import { inAppWallet } from "thirdweb/wallets";
 * const wallet = inAppWallet({
 *  metadata: {
 *    name: "My App",
 *    icon: "https://example.com/icon.png",
 *    image: {
 *      src: "https://example.com/logo.png",
 *      alt: "My logo",
 *      width: 100,
 *      height: 100,
 *   },
 *  },
 * });
 * ```
 *
 * ### Hide the ability to export the private key within the Connect Modal UI
 *
 * By default, the Connect Modal will show a button to export the private key of the wallet. You can hide this button by setting the `hidePrivateKeyExport` option to `true`.
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
 * By default, wallet state is stored in the browser's local storage if in the browser, or in-memory storage if not in the browser. You can override this behavior by providing a custom storage object, useful for server side and CLI integrations.
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
  createOptions?: InAppWalletCreationOptions,
): Wallet<"inApp"> {
  return createInAppWallet({
    connectorFactory: async (client: ThirdwebClient) => {
      const { InAppWebConnector } = await import("./lib/web-connector.js");
      return new InAppWebConnector({
        client,
        passkeyDomain: createOptions?.auth?.passkeyDomain,
        storage: createOptions?.storage,
      });
    },
    createOptions,
  }) as Wallet<"inApp">;
}

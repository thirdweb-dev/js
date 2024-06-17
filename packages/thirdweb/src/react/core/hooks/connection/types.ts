import type { ThirdwebClient } from "../../../../client/client.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import type { SmartWalletOptions } from "../../../../wallets/smart/types.js";
import type { AppMetadata } from "../../../../wallets/types.js";

export type AutoConnectProps = {
  /**
   * Array of wallets that your app uses
   * @example
   * ```tsx
   * import { AutoConnect } from "thirdweb/react";
   * import { createWallet, inAppWallet } from "thirdweb/wallets";
   *
   * const wallets = [
   *   inAppWallet(),
   *   createWallet("io.metamask"),
   *   createWallet("com.coinbase.wallet"),
   *   createWallet("me.rainbow"),
   * ];
   *
   * function Example() {
   *  return (
   *    <AutoConnect
   *      client={client}
   *      wallets={wallets}
   *    />
   *  )
   * }
   * ```
   */
  wallets: Wallet[];

  /**
   * A client is the entry point to the thirdweb SDK.
   * It is required for all other actions.
   * You can create a client using the `createThirdwebClient` function. Refer to the [Creating a Client](https://portal.thirdweb.com/typescript/v5/client) documentation for more information.
   *
   * You must provide a `clientId` or `secretKey` in order to initialize a client. Pass `clientId` if you want for client-side usage and `secretKey` for server-side usage.
   *
   * ```tsx
   * import { createThirdwebClient } from "thirdweb";
   *
   * const client = createThirdwebClient({
   *  clientId: "<your_client_id>",
   * })
   * ```
   */
  client: ThirdwebClient;

  /**
   * Metadata of the app that will be passed to connected wallet. Setting this is highly recommended.
   *
   * Some wallets display this information to the user when they connect to your app.
   * @example
   * ```ts
   * {
   *   name: "My App",
   *   url: "https://my-app.com",
   *   description: "some description about your app",
   *   logoUrl: "https://path/to/my-app/logo.svg",
   * };
   * ```
   */
  appMetadata?: AppMetadata;

  /**
   * if the autoConnection does not succeed within given timeout in milliseconds, it will be cancelled.
   *
   * By default, the timeout is set to 15000ms (15 seconds).
   *
   * ```tsx
   * <AutoConnect
   *  client={client}
   *  autoConnect={{ timeout: 10000 }}
   *  wallets={wallets}
   *  appMetadata={appMetadata}
   * />
   * ```
   */
  timeout?: number;

  /**
   * Enable Account abstraction for all wallets. This will connect to the users's smart account based on the connected personal wallet and the given options.
   *
   * If you are connecting to smart wallet using personal wallet - setting this configuration will autoConnect the personal wallet and then connect to the smart wallet.
   *
   * ```tsx
   * <AutoConnect
   *   accountAbstraction={{
   *    factoryAddress: "0x123...",
   *    chain: sepolia,
   *    gasless: true;
   *   }}
   * />
   */
  accountAbstraction?: SmartWalletOptions;

  /**
   * Callback to be called on successful auto-connection of last active wallet. The callback is called with the connected wallet
   *
   * ```tsx
   * <AutoConnect
   *  onConnect={(wallet) => {
   *    console.log("auto connected to", wallet)
   *  }}
   * />
   * ```
   */
  onConnect?: (wallet: Wallet) => void;
};

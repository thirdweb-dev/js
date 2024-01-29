import {
  type WalletConfig,
  WalletInstance,
  useCreateWalletInstance,
  useSetConnectedWallet,
  useSetConnectionStatus,
  useWalletContext,
  useWallets,
} from "@thirdweb-dev/react-core";
import type { SmartWalletConfigOptions } from "../../../wallet/wallets/smartWallet/types";
import {
  getSmartWalletAddress,
  type SmartWalletConnectionArgs,
} from "@thirdweb-dev/wallets/evm/wallets/smart-wallet";
import { useCallback } from "react";
import type { BytesLike } from "ethers";

/**
 * Hook to connect [Smart wallet](https://portal.thirdweb.com/references/wallets/v2/SmartWallet)
 *
 * `useSmartWallet()` handles connecting both the personal wallet and the Smart Wallet.
 *
 * The `smartWallet()` also need to be added in [`ThirdwebProvider`](https://portal.thirdweb.com/react/v4/ThirdwebProvider)'s `supportedWallets` prop to enable auto-connection on page load
 *
 * ### Example
 *
 * Set up ThirdwebProvider with supportedWallets
 *
 * ```tsx
 * <ThirdwebProvider
 *  supportedWallets={[
 *    smartWallet(
 *      metamaskWallet(),
 *    ),
 *    smartWallet(
 *      coinbaseWallet(),
 *    )
 *    // ...etc
 *  ]}
 * />
 * ```
 *
 * And then use the hook in your app to connect smart wallet
 *
 * ```tsx
 * import { useSmartWallet } from "@thirdweb-dev/react";
 *
 * function Example() {
 *   // Here we use metamask as the personal wallet
 *   const { connect } = useSmartWallet(metamaskWallet(), {
 *     factoryAddress: "0x...",
 *     gasless: true,
 *   });
 *
 *   return (
 *     <button
 *       onClick={async () => {
 *         await connect();
 *       }}
 *     >
 *       Connect Smart Wallet
 *     </button>
 *   );
 * }
 * ```
 *
 * ## Using `EmbeddedWallet` as the personal signer
 *
 * You can have your users sign in with email or social and then connect their associated Smart Wallet.
 *
 * ```tsx
 * const { connect } = useSmartWallet(embeddedWallet(), {
 *   factoryAddress: factoryAddress,
 *   gasless: true,
 * });
 *
 * const onClick = async () => {
 *   await connect({
 *     connectPersonalWallet: async (embeddedWallet) => {
 *       // login with google and connect the embedded wallet
 *       const authResult = await embeddedWallet.authenticate({
 *         strategy: "google",
 *       });
 *       await embeddedWallet.connect({ authResult });
 *     },
 *   });
 * };
 * ```
 *
 * ## Using `LocalWallet` as the personal signer
 *
 * You can generate wallets on device for your users and connect to the associated Smart Wallet.
 *
 * ```tsx
 * const { connect } = useSmartWallet(localWallet(), {
 *   factoryAddress: "0x...",
 *   gasless: true,
 * });
 *
 * const onClick = async () => {
 *   await connect({
 *     connectPersonalWallet: async (localWallet) => {
 *       // Generate and connect s local wallet before using it as the personal signer
 *       await localWallet.generate();
 *       await localWallet.connect();
 *     },
 *   });
 * };
 * ```
 *
 * ## Predicting the Smart Wallet address
 *
 * THe `useSmartWallet()` also returns a function to predict a smart wallet address given a personal wallet address before connecting to it.
 *
 * ```tsx
 * const { predictAddress } = useSmartWallet(localWallet(), {
 *   factoryAddress: "0x...",
 *   gasless: true,
 * });
 *
 * const onClick = async () => {
 *   const address = await predictAddress({
 *     personalWalletAddress: "0x...",
 *   });
 *   console.log("Predicted Smart Wallet address", address);
 * };
 * ```
 *
 * @param personalWallet - A wallet configuration object from [\@thirdweb-dev/react](https://www.npmjs.com/package/\@thirdweb-dev/react) package.
 *
 * Ex: `metamaksWallet()`, `coinbaseWallet()`, `walletConnectWallet()`, `embeddedWallet()`, `localWallet()`, etc.
 *
 * @param options - Smart Wallet configuration options
 *
 * #### factoryAddress (required)
 * The address of the Smart Wallet Factory contract. Must be of type `string`.
 *
 * #### gasless (required)
 * Whether to turn on or off gasless transactions.
 *
 * - If set to `true`, all gas fees will be paid by a paymaster.
 * - If set to `false`, all gas fees will be paid by the Smart Wallet itself (needs to be funded).
 *
 * Must be a `boolean`.
 *
 * #### factoryInfo (optional)
 * Customize how the Smart Wallet Factory contract is interacted with. If not provided, the default functions will be used.
 *
 * Must be a `object`. The object can contain the following properties:
 *
 * - `createAccount` - a function that returns the transaction object to create a new Smart Wallet.
 * - `getAccountAddress` - a function that returns the address of the Smart Wallet contract given the owner address.
 * - `abi` - optional ABI. If not provided, the ABI will be auto-resolved.
 *
 * ```javascript
 *  {
 *   createAccount: (factory, owner) => {
 *     return factory.prepare("customCreateAccount", [
 *       owner,
 *       getExtraData(),
 *     ]);
 *   },
 *   getAccountAddress(factory, owner) {
 *     return factory.call("getAccountAddress", [owner]);
 *   },
 *   abi: [...]
 * }
 * ```
 *
 * #### accountInfo (optional)
 * Customize how the Smart Wallet Account contract is interacted with. If not provided, the default functions will be used.
 *
 * Must be a `object`. The object can contain the following properties:
 *
 * - `execute` - a function that returns the transaction object to execute an arbitrary transaction.
 * - `getNonce` - a function that returns the current nonce of the account.
 * - `abi` - optional ABI. If not provided, the ABI will be auto-resolved.
 *
 * ```javascript
 * {
 *   execute(account, target, value, data) {
 *     return account.prepare("customExecute", [
 *       target, value, data
 *     ]);
 *   },
 *   getNonce(account) {
 *     return account.call("getNonce");
 *   },
 *   abi: [...]
 * }
 * ```
 *
 * #### bundlerUrl (optional)
 * Your own bundler URL to send user operations to. Uses thirdweb's bundler by default.
 *
 * Must be a `string`.
 *
 * #### paymasterUrl (optional)
 * Your own paymaster URL to send user operations to for gasless transactions. Uses thirdweb's paymaster by default.
 *
 * Must be a `string`.
 *
 * #### entryPointAddress
 * The entrypoint contract address. Uses v0.6 by default.
 *
 * Must be a `string`.
 * 
 * #### deployOnSign
 * Whether to deploy the smart wallet when the user signs a message. Defaults to true.
 * 
 * Must be a `boolean`.
 *
 * @walletConnection
 */
export function useSmartWallet<W extends WalletInstance>(
  personalWallet: WalletConfig<W>,
  options: SmartWalletConfigOptions,
) {
  const create = useCreateWalletInstance();
  const setStatus = useSetConnectionStatus();
  const setWallet = useSetConnectedWallet();
  const context = useWalletContext();
  const supportedWallets = useWallets();

  const predictAddress = useCallback(
    async (args: { personalWalletAddress: string; data?: BytesLike }) => {
      return getSmartWalletAddress(
        context.activeChain,
        options.factoryAddress,
        args.personalWalletAddress,
        args.data,
      );
    },
    [context.activeChain, options.factoryAddress],
  );

  const connect = useCallback(
    async (args?: {
      connectPersonalWallet?: (wallet: W) => Promise<void>;
      connectionArgs?: Omit<SmartWalletConnectionArgs, "personalWallet">;
    }) => {
      if (!supportedWallets.find((w) => w.id === personalWallet.id)) {
        console.warn(
          "Please, add your smart wallet to the supportedWallets prop of the ThirdwebProvider to enjoy auto-connecting to the wallet.",
        );
      }
      const { smartWallet } = await import(
        "../../../wallet/wallets/smartWallet/smartWallet"
      );
      setStatus("connecting");
      const pw = create(personalWallet);
      const sw = create(smartWallet(personalWallet, options));
      try {
        if (args?.connectPersonalWallet) {
          // if passed in, use custom function to connect personal wallet
          await args.connectPersonalWallet(pw);
        } else {
          // otherwise default to auto-connecting personal wallet with chainId
          await pw.connect({
            chainId: context.activeChain.chainId,
          });
        }
        await sw.connect({
          ...args?.connectionArgs,
          personalWallet: pw,
        });
        setStatus("connected");
        setWallet(sw);
      } catch (e) {
        console.error("Error connecting to smart wallet", e);
        setStatus("disconnected");
        throw e;
      }
      return sw;
    },
    [
      context.activeChain.chainId,
      create,
      options,
      personalWallet,
      setStatus,
      setWallet,
      supportedWallets,
    ],
  );

  return {
    connect,
    predictAddress,
  };
}

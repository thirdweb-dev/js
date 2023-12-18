import { Chain, defaultChains } from "@thirdweb-dev/chains";
import { useCallback, useState } from "react";
import { useChain, useChainId } from "../../evm/hooks/wallet";
import { useSupportedChains } from "../../evm/hooks/useSupportedChains";
import { useSwitchChain, useWallet } from "./wallet-hooks";
import { assertWindowEthereum, walletIds } from "@thirdweb-dev/wallets";

// this hook is only for backwards compatibility

type SwitchNetwork = (chainId: number) => Promise<
  | {
      data: Chain | undefined;
      error: undefined;
    }
  | {
      data: undefined;
      error: Error;
    }
>;

type NetworkMetadata = {
  data: {
    chain: Chain | { chainId: number; unsupported: true } | undefined;
    chains: Chain[];
  };
  error: Error | undefined;
  loading: boolean | undefined;
};

/**
 *
 *
 * Hook for getting metadata about the network the current wallet is connected to and switching networks
 *
 * It's important to note that some wallet apps do not support programmatic network switching and switchNetwork will be undefined.
 * For those situations, you can typically switch networks in the wallet app this hook will still work.
 *
 * Hook for getting information about the current network and switching to a different network.
 *
 * Returns an array value containing two elements.
 *
 * 1. An object containing the following properties:
 *
 *    - `data` object contains information about the wallet's current and supported networks.
 *    - `loading` indicates if the switch network request is in progress.
 *    - `error` holds the `Error` object if there was an error when attempting to switch network.
 *
 * 2. A function to switch to a different network.
 *
 * @example
 * ```javascript
 * import { useNetwork } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const [{ data, error, loading }, switchNetwork] = useNetwork();
 *
 *   return (
 *     <button
 *       onClick={async () => {
 *         if (!switchNetwork) {
 *           console.log("can not switch network");
 *           return;
 *         }
 *
 *         const result = await switchNetwork(80001);
 *         if (result.data) {
 *           console.log("Switched to Mumbai testnet successfully");
 *         } else {
 *           console.log("Error switching to Mumbai testnet", result.error);
 *         }
 *       }}
 *     >
 *       Switch to Mumbai
 *     </button>
 *   );
 * }
 * ```
 *
 * @returns
 *
 * ```ts
 * const [{ data, error, loading }, switchNetwork] = useNetwork();
 * ```
 * #### data
 *
 * If wallet is connected to a network that is one of `supportedChains` provided in `ThirdwebProvider` or one of the default supported chains, `data` object will contain the following:
 *
 * ```ts
 * {
 *   chain: Chain; // The connected network
 *   chains: Chain[]; // All supported networks
 * }
 * ```
 *
 * If wallet is connected to a network that is NOT one of `supportedChains` provided in `ThirdwebProvider` or default supported, `data` object will contain the following:
 *
 * ```ts
 * {
 *   // chainId of current connected network + unsupported flag
 *   chain: { chainId: number, unsupported: true };
 *   // All supported networks
 *   chains: Chain[];
 * }
 * ```
 *
 * If wallet is not connected, `data` object will contain the following:
 *
 * ```ts
 * {
 *   chain: undefined;
 *   chains: []; // Empty array
 * }
 * ```
 *
 * #### error
 *
 * `error` contains an `Error` object if there was an error when attempting to switch network using the `switchNetwork` function
 *
 * `undefined` if there is no switch network error
 *
 * ```ts
 * Error | undefined;
 * ```
 *
 * #### loading
 *
 * `loading` is `true` when switching network using the `switchNetwork` function, and `false` otherwise.
 *
 *
 * #### switchNetwork
 *
 * `switchNetwork` is a function to switch to a different network. It takes a `chainId` as an argument and returns a promise that resolves to an object containing `data` and `error` properties.
 *
 * If switching network was successful, `data` will contain the new network information. and `error` will be `undefined`. If switching network failed, `data` will be `undefined` and `error` will contain an `Error` object.
 *
 * `switchNetwork` is `undefined` if not connected to a wallet or if the connected wallet does not allow programmatic switching.
 *
 * ```ts
 * type SwitchNetwork = undefined | (chainId: number) => Promise<
 *   | {
 *       data: Chain | undefined;
 *       error: undefined;
 *     }
 *   | {
 *       data: undefined;
 *       error: Error;
 *     }>
 * ```
 *
 * @deprecated use `useChain`, `useSwitchChain`, `useChainId` instead
 * @internal
 */
export function useNetwork(): [NetworkMetadata, SwitchNetwork | undefined] {
  const chain = useChain();
  const chainId = useChainId();
  const switchChain = useSwitchChain();
  const supportedChains = useSupportedChains();
  const wallet = useWallet();

  const isMetamaskInstalled = assertWindowEthereum(globalThis.window)
    ? globalThis.window.ethereum.isMetaMask
    : false;

  const isCoinbaseInstalled = assertWindowEthereum(globalThis.window)
    ? globalThis.window.ethereum.isCoinbaseWallet
    : false;

  // switch not supported if connected to a mobile wallet
  const switchChainNotSupported =
    !wallet ||
    wallet.walletId === walletIds.walletConnectV1 ||
    wallet.walletId === walletIds.walletConnect ||
    (wallet.walletId === walletIds.metamask && !isMetamaskInstalled) ||
    (wallet.walletId === walletIds.coinbase && !isCoinbaseInstalled);

  // error when switching network
  const [error, setError] = useState<Error | undefined>(undefined);

  // loading: true when switching network
  const [loading, setLoading] = useState(false);

  const switchNetwork: SwitchNetwork = useCallback(
    async (_chainId: number) => {
      // reset error and loading
      setLoading(true);
      setError(undefined);

      try {
        await switchChain(_chainId);
      } catch (e: any) {
        setError(e);
        setLoading(false);

        return {
          data: undefined,
          error: e,
        };
      }

      setLoading(false);

      return {
        data:
          supportedChains.find((c) => c.chainId === _chainId) ||
          defaultChains.find((c) => c.chainId === _chainId),
        error: undefined,
      };
    },
    [switchChain, supportedChains],
  );

  return [
    {
      data: {
        chain:
          chainId === undefined
            ? undefined
            : chain || { chainId, unsupported: true },
        chains: wallet ? supportedChains : [],
      },
      error: error,
      loading,
    },
    switchChainNotSupported ? undefined : switchNetwork,
  ];
}

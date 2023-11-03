import type { Chain } from "@thirdweb-dev/chains";
import { defaultChains } from "@thirdweb-dev/chains/defaultChains";
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
 * @deprecated - use `useChain`, `useSwitchChain`, `useChainId` instead
 *
 * Hook for getting metadata about the network the current wallet is connected to and switching networks
 *
 * @example
 * ```javascript
 * import { useNetwork } from "@thirdweb-dev/react";
 *
 * const App = () => {
 *   const [, switchNetwork] = useNetwork();
 *   return (
 *      // switchNetwork is undefined if the wallet does not support programmatic network switching
 *      // 137 is the chainId for Polygon in this example
 *     <button onClick={() => switchNetwork(137)}>
 *        Switch Network
 *     </button>
 *   );
 * };
```
 *
 * It's important to note that some wallet apps do not support programmatic network switching and switchNetwork will be undefined.
 * For those situations, you can typically switch networks in the wallet app this hook will still work.
 *
 * @public
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

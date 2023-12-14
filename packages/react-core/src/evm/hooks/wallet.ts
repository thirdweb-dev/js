import invariant from "tiny-invariant";
import {
  ThirdwebConnectedWalletContext,
  useThirdwebConnectedWalletContext,
} from "../contexts/thirdweb-wallet";
import { ContractAddress } from "../types";
import { cacheKeys } from "../utils/cache-keys";
import { useSupportedChains } from "./useSupportedChains";
import { useQuery } from "@tanstack/react-query";
import { Chain, defaultChains } from "@thirdweb-dev/chains";
import { useContext, useMemo } from "react";
import { useSDK } from "./useSDK";
import { useWalletContext } from "../../core/providers/thirdweb-wallet-provider";

/**
 * A hook to get the native or (optional) ERC20 token balance of the connected wallet.
 *
 * @param tokenAddress - the address of the token contract, if empty will use the chain's native token
 * @returns the balance of the connected wallet (native or ERC20)
 */
export function useBalance(tokenAddress?: ContractAddress) {
  const walletAddress = useAddress();

  const { wallet, address, chainId } = useThirdwebConnectedWalletContext();

  const cacheKey = useMemo(() => {
    return cacheKeys.wallet.balance(chainId || -1, address, tokenAddress);
  }, [chainId, tokenAddress, address]);

  return useQuery(
    cacheKey,
    () => {
      return wallet?.balance(tokenAddress);
    },
    {
      // if user is not logged in no reason to try to fetch
      enabled: !!wallet && !!walletAddress && !!chainId,
      retry: true,
      keepPreviousData: false,
    },
  );
}

/**
 * Get the native token balance of a wallet address on the `activeChain` network set in the `ThirdwebProvider`
 *
 * @param walletAddress - the address of the wallet that you want to get the native balance
 * @returns the balance of the given wallet address
 */
export function useBalanceForAddress(walletAddress: string) {
  invariant(walletAddress, "wallet address is not provided");
  const { activeChain } = useWalletContext();
  const chainId = activeChain.chainId;
  const sdk = useSDK();
  const cacheKey = useMemo(() => {
    return cacheKeys.wallet.balance(chainId, walletAddress);
  }, [chainId, walletAddress]);

  return useQuery(cacheKey, async () => {
    invariant(sdk, "SDK is not initialized");
    return await sdk.getBalance(walletAddress);
  });
}

/**
 * @internal
 */
export function useConnectedWallet() {
  const context = useContext(ThirdwebConnectedWalletContext);
  invariant(
    context,
    "useConnectedWallet() hook must be used within a <ThirdwebProvider/>",
  );
  return context.signer;
}

/**
 * Get the address of the connected wallet.
 *
 * Returns `undefined` if no wallet is connected.
 *
 * @example
 * ```tsx
 * import { useAddress } from "@thirdweb-dev/react"
 *
 * function Example() {
 *   const address = useAddress()
 *
 *   return <div>{address}</div>
 * }
 * ```
 */
export function useAddress(): string | undefined {
  const context = useContext(ThirdwebConnectedWalletContext);
  invariant(
    context,
    "useAddress() hook must be used within a <ThirdwebProvider/>",
  );
  return context.address;
}

/**
 * Hook for accessing the chain ID of the network the current wallet is connected to
 *
 * ```javascript
 * import { useChainId } from "@thirdweb-dev/react"
 * ```
 *
 * @example
 * ```javascript
 * import { useChainId } from "@thirdweb-dev/react"
 *
 * const App = () => {
 *   const chainId = useChainId()
 *
 *   return <div>{chainId}</div>
 * }
 * ```
 *
 * @returns
 * A `number` representing the current chain id, or `undefined` if the user is not connected to a wallet.
 *
 * For Example, if the user is connected to the Ethereum Mainnet, the return value will be `1`.
 *
 * @networkConnection
 */
export function useChainId(): number | undefined {
  const context = useContext(ThirdwebConnectedWalletContext);
  invariant(
    context,
    "useChainId() hook must be used within a <ThirdwebProvider/>",
  );
  return context.chainId;
}

/**
 * Hook for getting the `Chain` object of the network that the user is connected - but only if
 * it's a supported network (added in the `ThirdwebProvider`'s [supportedChains](/react/react.thirdwebprovider#supportedchains-optional) or one of [default chains](/react/react.thirdwebprovider#default-chains) ).
 *
 * Returns `undefined` if the network is not supported or the user is not connected to a wallet. You can use the [useConnectionStatus](/react/react.useconnectionstatus) hook to check if the user is connected to a wallet or not to differentiate between the two cases.
 *
 * If you only want to get the chain id of the network the user is connected to regardless of whether it's supported or not, use [useChainId](/react/react.usechainid) instead.
 *
 * ```jsx
 * import { useChain } from "@thirdweb-dev/react";
 *
 * const chain = useChain();
 * ```
 *
 * @example
 *
 * ```jsx
 * import { useChain, useConnectionStatus } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const chain = useChain();
 *   const status = useConnectionStatus();
 *
 *   if (status === "unknown") return <div> Loading... </div>;
 *   if (status === "disconnected") return <div> disconnected </div>;
 *   if (status === "connecting") return <div> connecting... </div>;
 *
 *   if (chain) {
 *     return <p> Connected to {chain.name} </p>;
 *   }
 *
 *   return <p> Connected to an unsupported network </p>;
 * }
 * ```
 *
 * @returns
 * An object of type `Chain` from [`@thirdweb-dev/chains`](https://www.npmjs.com/package/\@thirdweb-dev/chains) package containing various information about the network, or `undefined` if the network is not supported or user is not connected to a wallet.
 *
 * @networkConnection
 */
export function useChain(): Chain | undefined {
  const chainId = useChainId();

  const chains = useSupportedChains();

  const chain = useMemo(() => {
    return chains.find((_chain) => _chain.chainId === chainId);
  }, [chainId, chains]);

  const unknownChain = useMemo(() => {
    if (!chain) {
      return defaultChains.find((c) => c.chainId === chainId);
    }
  }, [chainId, chain]);

  return chain || unknownChain;
}

/**
 * @deprecated
 *
 * This hook is renamed to `useChain`
 *
 * use the `useChain` hook instead
 */
export function useActiveChain() {
  return useChain();
}

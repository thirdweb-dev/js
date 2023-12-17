import invariant from "tiny-invariant";
import {
  ThirdwebConnectedWalletContext,
  useThirdwebConnectedWalletContext,
} from "../contexts/thirdweb-wallet";
import { ContractAddress } from "../types";
import { cacheKeys } from "../utils/cache-keys";
import { useSupportedChains } from "./useSupportedChains";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { Chain, defaultChains } from "@thirdweb-dev/chains";
import { useContext, useMemo } from "react";
import { useSDK } from "./useSDK";
import { useWalletContext } from "../../core/providers/thirdweb-wallet-provider";
import { BigNumber } from "ethers";

/**
 * Hook for getting a wallet's current balance of native or (optional) ERC20 token balance
 *
 * @example
 *
 * ### get the balance of the native token
 *
 * ```jsx
 * import { useBalance } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const { data, isLoading } = useBalance();
 * }
 * ```
 *
 * ### get the balance of any other token
 *
 * ```jsx
 * import { useBalance } from "@thirdweb-dev/react";
 *
 * // ERC20 token smart contract address
 * const tokenAddress = "{{token_address}}";
 *
 * function App() {
 *   const { data, isLoading } = useBalance(tokenAddress);
 * }
 * ```
 *
 * @param tokenAddress - the address of the token contract, if not provided, it defaults to the native token
 *
 * @returns
 * The hook's `data` property contains the token's balance in the `value` property as a `BigNumber` object.
 *
 * @token
 */
export function useBalance(tokenAddress?: ContractAddress): UseQueryResult<
  | {
      symbol: string;
      value: BigNumber;
      name: string;
      decimals: number;
      displayValue: string;
    }
  | undefined,
  unknown
> {
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
 * This hook is similar to the `useBalance` hook, but it for fetching the native token balance of any given wallet address.
 *
 * This hook only fetches the native token balance of the given wallet address. If you want to get the ERC20 balance from a given wallet, use `useTokenBalance`
 *
 * @example
 * ```ts
 * const { data, isLoading } = useBalanceForAddress(walletAddress)
 * ```
 *
 * @param walletAddress - the address of the wallet that you want to get the native balance
 *
 * @returns
 * The hook's `data` property contains the native token's balance in the `value` property as a `BigNumber` object.
 *
 * @token
 */
export function useBalanceForAddress(walletAddress: string): UseQueryResult<
  {
    symbol: string;
    value: BigNumber;
    name: string;
    decimals: number;
    displayValue: string;
  },
  unknown
> {
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
 *
 * @walletConnection
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
 * it's a supported network (added in the `ThirdwebProvider`'s `supportedChains` or one of default chains
 *
 * Returns `undefined` if the network is not supported or the user is not connected to a wallet. You can use the `useConnectionStatus` hook to check if the user is connected to a wallet or not to differentiate between the two cases.
 *
 * If you only want to get the chain id of the network the user is connected to regardless of whether it's supported or not, use `useChainId` instead.
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
 * @internal
 * @deprecated
 *
 * This hook is renamed to `useChain`
 *
 * use the `useChain` hook instead
 */
export function useActiveChain() {
  return useChain();
}

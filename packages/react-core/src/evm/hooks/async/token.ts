import {
  requiredParamInvariant,
  RequiredParam,
} from "../../../core/query-utils/required-param";
import { useSDK, useSDKChainId } from "../useSDK";
import {
  ClaimTokenParams,
  getErc20,
  TokenBurnParams,
  TokenContract,
  TokenParams,
  WalletAddress,
} from "../../types";
import {
  cacheKeys,
  invalidateBalances,
  invalidateContractAndBalances,
} from "../../utils/cache-keys";
import { useQueryWithNetwork } from "../query-utils/useQueryWithNetwork";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import type { BigNumber, providers } from "ethers";
import invariant from "tiny-invariant";

/** **********************/
/**     READ  HOOKS     **/
/** **********************/

/**
 * Hook for fetching the total supply of an ERC20 token.
 *
 * This takes into account the increase and decrease in supply when tokens are minted and burned.
 *
 * @example
 * ```jsx
 * import { useTokenSupply } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress);
 *   const { data, isLoading, error } = useTokenSupply(contract);
 * }
 * ```
 *
 * @param contract - Instance of a `TokenContract`
 *
 * @returns Hook's `data` object includes the total supply of the token in the `value` property as a `BigNumber` object.
 *
 * @twfeature ERC20
 * @token
 */
export function useTokenSupply(
  contract: RequiredParam<TokenContract>,
): UseQueryResult<
  {
    symbol: string;
    value: BigNumber;
    name: string;
    decimals: number;
    displayValue: string;
  },
  unknown
> {
  const contractAddress = contract?.getAddress();
  return useQueryWithNetwork(
    cacheKeys.contract.token.totalSupply(contractAddress),
    () => {
      requiredParamInvariant(contract, "No Contract instance provided");
      const erc20 = getErc20(contract);
      if (erc20) {
        return erc20.totalSupply();
      }
      invariant(false, "Smart contract is not a valid erc20 contract");
    },
    {
      enabled: !!contract || !!contractAddress,
    },
  );
}

/**
 * Hook for fetching the balance a wallet has for a specific ERC20 token.
 *
 * __This hook is for _custom_ ERC20 tokens. For native tokens such as Ether, use `useBalance` or `useBalanceForAddress`__
 *
 * Available to use on contracts that implement the ERC20 interface.
 *
 * @example
 * ```jsx
 * import { useTokenBalance, useContract } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress, "token");
 *   const { data, isLoading, error } = useTokenBalance(contract, walletAddress);
 * }
 * ```
 *
 * @param contract - Instance of a `TokenContract`
 *
 * @returns Hook's `data` object includes the token balance for given wallet address
 *
 * @twfeature ERC20
 * @token
 */
export function useTokenBalance(
  contract: RequiredParam<TokenContract>,
  walletAddress: RequiredParam<WalletAddress>,
): UseQueryResult<
  {
    symbol: string;
    value: BigNumber;
    name: string;
    decimals: number;
    displayValue: string;
  },
  unknown
> {
  const contractAddress = contract?.getAddress();
  const erc20 = getErc20(contract);
  return useQueryWithNetwork(
    cacheKeys.contract.token.balanceOf(contractAddress, walletAddress),
    async () => {
      requiredParamInvariant(contract, "No Contract instance provided");
      invariant(walletAddress, "No address provided");
      if (erc20) {
        return await erc20.balanceOf(walletAddress);
      }
      invariant(false, "Smart contract is not a valid erc20 contract");
    },

    {
      enabled: !!walletAddress && !!contract,
    },
  );
}

/**
 * Hook for fetching the [decimals](https://docs.openzeppelin.com/contracts/3.x/erc20#a-note-on-decimals)
 * of an [ERC20](https://portal.thirdweb.com/contracts/build/extensions/erc-20/ERC20) token.
 *
 * Tokens usually opt for a value of `18`, imitating the relationship between Ether and Wei.
 * Therefore, `18` is the default value returned by this function, unless your ERC20 contract explicitly overrides it.
 *
 * @example
 *
 * ```jsx
 * import { useTokenDecimals, useContract } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress, "token");
 *   const { data, isLoading, error } = useTokenDecimals(contract);
 * }
 * ```
 *
 * @param contract - Instance of a `TokenContract`
 *
 * @returns The hook's `data` property, once loaded, contains the `number` that represents the number of decimals of the ERC20 token.
 *
 * @twfeature ERC20
 * @token
 */
export function useTokenDecimals(contract: RequiredParam<TokenContract>) {
  const contractAddress = contract?.getAddress();
  const erc20 = getErc20(contract);
  return useQueryWithNetwork(
    cacheKeys.contract.token.decimals(contractAddress),
    async () => {
      requiredParamInvariant(contract, "No Contract instance provided");

      if (erc20) {
        return (await erc20.get()).decimals;
      }
      invariant(false, "Smart contract is not a valid erc20 contract");
    },
    {
      enabled: !!contract,
    },
  );
}

/** **********************/
/**     WRITE HOOKS     **/
/** **********************/

/**
 * Hook for minting new tokens in an ERC20 smart contract.
 *
 * Available to use on contracts that implement the [ERC20Mintable](https://portal.thirdweb.com/contracts/build/extensions/erc-20/ERC20BatchMintable)
 * interface, such as the [Token](https://thirdweb.com/thirdweb.eth/TokenERC20) contract.
 *
 * The wallet address that initiates this transaction must have minting permissions on the contract.
 *
 * @example
 *
 * ```jsx
 * import { useContract, useMintToken, Web3Button } from "@thirdweb-dev/react";
 *
 * const contractAddress = "{{contract_address}}";
 * const walletAddress = "{{wallet_address}}";
 * const tokenAmount = "{{token_amount}}";
 *
 * function App() {
 *   // Contract must be an ERC-20 contract that implements the ERC20Mintable interface
 *   const { contract } = useContract(contractAddress, "token");
 *   const { mutateAsync: mintToken, isLoading, error } = useMintToken(contract);
 *
 *   return (
 *     <Web3Button
 *       contractAddress={contractAddress}
 *       action={() =>
 *         mintToken({
 *           amount: tokenAmount, // Quantity to mint
 *           to: walletAddress, // Address to mint to
 *         })
 *       }
 *     >
 *       Mint Token
 *     </Web3Button>
 *   );
 * }
 * ```
 *
 * @param contract - Instance of a `TokenContract`
 *
 * @returns A mutation object to mint new tokens to the connected wallet
 *
 * ```ts
 * const { mutateAsync, isLoading, error } = useMintToken(contract);
 * ```
 *
 * ### options
 * The mutation function takes an object as an argument with the following properties:
 *
 * #### amount
 * The quantity of tokens to mint. Can be a `string` or `number`.
 *
 * #### to
 * The wallet address to mint the new tokens to.
 *
 * To use the connected wallet address, use the `useAddress` hook.
 *
 * @twfeature ERC20Mintable
 * @token
 */
export function useMintToken(
  contract: RequiredParam<TokenContract>,
): UseMutationResult<
  Omit<
    {
      receipt: providers.TransactionReceipt;
      data: () => Promise<unknown>;
    },
    "data"
  >,
  unknown,
  TokenParams,
  unknown
> {
  const activeChainId = useSDKChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();
  const erc20 = getErc20(contract);

  return useMutation(
    (data: TokenParams) => {
      const { to, amount } = data;
      requiredParamInvariant(contract, "contract is undefined");
      if (erc20) {
        return erc20.mintTo(to, amount);
      }
      invariant(false, "Smart contract is not a valid erc20 contract");
    },
    {
      onSettled: () =>
        invalidateContractAndBalances(
          queryClient,
          contractAddress,
          activeChainId,
        ),
    },
  );
}

/**
 * Hook for claiming a ERC20 tokens from a smart contract.
 *
 * Available to use on smart contracts that implement both the [ERC20](https://portal.thirdweb.com/contracts/build/extensions/erc-20/ERC20) interface
 * and the [`claim`](https://portal.thirdweb.com/contracts/build/extensions/erc-721/ERC721Claimable) function,
 * such as the [Token Drop](https://thirdweb.com/thirdweb.eth/DropERC20).
 *
 * @example
 *
 * ```jsx
 * import { useClaimToken, useContract, Web3Button } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress);
 *   const { mutateAsync: claimToken, isLoading, error } = useClaimToken(contract);
 *
 *   return (
 *     <Web3Button
 *       contractAddress={contractAddress}
 *       action={() =>
 *         claimToken({
 *           to: "{{wallet_address}}", // Use useAddress hook to get current wallet address
 *           amount: 100, // Amount of token to claim
 *         })
 *       }
 *     >
 *       Claim Token
 *     </Web3Button>
 *   );
 * }
 * ```
 *
 * @param contract - Instance of a `TokenContract`
 *
 * @returns A mutation object to tokens to the wallet specified in the params
 *
 * ```ts
 * const { mutateAsync, isLoading, error } = useClaimToken(contract);
 * ```
 *
 * ### options
 * The mutation function takes an object as an argument with the following properties:
 *
 * #### to (required)
 * Likely, you will want to claim the token to the currently connected wallet address.
 *
 * You can use the `useAddress` hook to get this value.
 *
 * #### amount (required)
 * The amount of tokens to be claimed.
 *
 * #### checkERC20Allowance (optional)
 * Boolean value to check whether the current wallet has enough allowance to pay for claiming the tokens before
 * attempting to claim the tokens.
 *
 * Defaults to `true`.
 *
 * @twfeature ERC20ClaimPhasesV2 | ERC20ClaimPhasesV1 | ERC20ClaimConditionsV2 | ERC20ClaimConditionsV1
 * @token
 */
export function useClaimToken(contract: RequiredParam<TokenContract>) {
  const activeChainId = useSDKChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();
  const erc20 = getErc20(contract);

  return useMutation(
    async (data: ClaimTokenParams) => {
      invariant(data.to, 'No "to" address provided');
      if (erc20) {
        invariant(erc20?.claimTo, "contract does not support claimTo");
        return await erc20.claimTo(data.to, data.amount, {
          checkERC20Allowance: data.checkERC20Allowance,
        });
      }
      invariant(false, "Smart contract is not a valid erc20 contract");
    },
    {
      onSettled: () =>
        invalidateContractAndBalances(
          queryClient,
          contractAddress,
          activeChainId,
        ),
    },
  );
}

/**
 * Hook for transferring tokens on an ERC20 contract.
 *
 * Available to use on contracts that implement the [ERC20](https://portal.thirdweb.com/contracts/build/extensions/erc-20/ERC20)
 * interface, such as the [Token](https://thirdweb.com/thirdweb.eth/TokenERC20) contract.
 *
 * The wallet address that initiates this transaction must have a balance of tokens
 * greater than or equal to the amount being transferred.
 *
 * @example
 * ```jsx
 * import { useContract, useTransferToken, Web3Button } from "@thirdweb-dev/react";
 *
 * const contractAddress = "{{contract_address}}";
 * const toAddress = "{{to_address}}";
 * const amount = "{{amount}}";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress);
 *   const {
 *     mutate: transferTokens,
 *     isLoading,
 *     error,
 *   } = useTransferToken(contract);
 *
 *   return (
 *     <Web3Button
 *       contractAddress={contractAddress}
 *       action={() =>
 *         transferTokens({
 *           to: toAddress, // Address to transfer to
 *           amount: amount, // Amount to transfer
 *         })
 *       }
 *     >
 *       Transfer
 *     </Web3Button>
 *   );
 * }
 * ```
 *
 * @param contract - Instance of a `TokenContract`
 *
 * @returns A mutation object to transfer tokens
 *
 * ```ts
 * const { mutateAsync, isLoading, error } = useTransferToken(contract);
 * ```
 *
 * ### options
 * The mutation function takes an object as an argument with the following properties:
 *
 * #### to
 * The wallet address to transfer tokens to.
 *
 * #### amount
 * The quantity of tokens to transfer. Can be a `string` or `number`.
 *
 * @twfeature ERC20
 * @token
 */
export function useTransferToken(contract: RequiredParam<TokenContract>) {
  const activeChainId = useSDKChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();
  const erc20 = getErc20(contract);

  return useMutation(
    (data: TokenParams) => {
      const { to, amount } = data;
      if (erc20) {
        invariant(erc20?.transfer, "contract does not support transfer");
        return erc20.transfer(to, amount);
      }
      invariant(false, "Smart contract is not a valid erc20 contract");
    },
    {
      onSettled: () =>
        invalidateContractAndBalances(
          queryClient,
          contractAddress,
          activeChainId,
        ),
    },
  );
}

/**
 * A hook to transfer native token (of the active chain) to another wallet
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const {
 *     mutate: transferNativeToken,
 *     isLoading,
 *     error,
 *   } = useTransferNativeToken();
 *
 *   if (error) {
 *     console.error("failed to transfer tokens", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => transferNativeToken({ to: "{{wallet_address}}", amount: "0.1" })}
 *     >
 *       Transfer
 *     </button>
 *   );
 * };
 * ```
 *
 * @returns A Mutation object to transfer native tokens
 *
 * ```ts
 * const { mutateAsync, isLoading, error } = useTransferNativeToken();
 * ```
 *
 * ### options
 * The mutation function takes an object containing `to` and `amount` properties.
 *
 * - `to` - The wallet address to transfer tokens to. Must be a `string`.
 * - `amount` - The amount of tokens to transfer. Must be a `number`.
 *
 * @token
 */
export function useTransferNativeToken() {
  const sdk = useSDK();
  const activeChainId = useSDKChainId();
  const queryClient = useQueryClient();
  return useMutation(
    (data: TokenParams) => {
      const { to, amount } = data;
      invariant(sdk, "SDK is not initialized");
      return sdk.wallet.transfer(to, amount);
    },
    {
      onSettled: () => invalidateBalances(queryClient, activeChainId),
    },
  );
}

/**
 * Hook for transferring ERC20 tokens to multiple recipients in a single transaction (i.e. airdrop).
 *
 * Available to use on contracts that implement the [ERC20](https://portal.thirdweb.com/contracts/build/extensions/erc-20/ERC20) interface.
 *
 * The wallet that initiates this transaction must have sufficient balance to cover the total amount of tokens being transferred
 * and must have transfer permissions on the contract, i.e. tokens are not soulbound.
 *
 * @example
 *
 * Provide your token contract instance from the `useContract` hook to the hook.
 *
 * Then, provide an array of objects with the `to` and `amount` properties to the function.
 *
 * ```jsx
 * import {
 *   useTransferBatchToken,
 *   useContract,
 *   Web3Button,
 * } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress, "token");
 *   const {
 *     mutateAsync: transferBatchToken,
 *     isLoading,
 *     error,
 *   } = useTransferBatchToken(contract);
 *
 *   return (
 *     <Web3Button
 *       contractAddress={contractAddress}
 *       action={() =>
 *         transferBatchToken([
 *           {
 *             to: "{{wallet_address}}", // Transfer 10 tokens to a wallet
 *             amount: 10,
 *           },
 *           {
 *             to: "{{wallet_address}}", // Transfer 20 tokens to another wallet
 *             amount: 20,
 *           },
 *         ])
 *       }
 *     >
 *       Transfer Batch Tokens
 *     </Web3Button>
 *   );
 * }
 * ```
 *
 * @param contract - Instance of a `TokenContract`
 *
 * @returns A Mutation object to transfer batch tokens
 *
 * ```ts
 * const { mutateAsync, isLoading, error } = useTransferBatchToken(contract);
 * ```
 *
 * ### options
 *
 * The mutation function takes an array of objects containing `to` and `amount` properties.
 *
 * - `to` - The wallet address to transfer tokens to. Must be a `string`.
 * - `amount` - The amount of tokens to transfer. Must be a `number`.
 *
 * @twfeature ERC20
 * @token
 */
export function useTransferBatchToken(contract: RequiredParam<TokenContract>) {
  const activeChainId = useSDKChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();
  const erc20 = getErc20(contract);

  return useMutation(
    (data: TokenParams[]) => {
      if (erc20) {
        invariant(
          erc20.transferBatch,
          "contract does not support transferBatch",
        );
        const convertedData = data.map((token) => ({
          toAddress: token.to,
          amount: token.amount,
        }));

        return erc20.transferBatch(convertedData);
      }
      invariant(false, "Smart contract is not a valid erc20 contract");
    },
    {
      onSettled: () =>
        invalidateContractAndBalances(
          queryClient,
          contractAddress,
          activeChainId,
        ),
    },
  );
}

/**
 * Hook for burning ERC20 tokens on a smart contract.
 *
 * Available to use on smart contracts that implement the [ERC20](https://portal.thirdweb.com/contracts/build/extensions/erc-20/ERC20) standard.
 *
 * @example
 *
 * ```jsx
 * import { useBurnToken, useContract, Web3Button } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress);
 *   const { mutateAsync: burnToken, isLoading, error } = useBurnToken(contract);
 *
 *   return (
 *     <Web3Button
 *       contractAddress={contractAddress}
 *       action={() =>
 *         burnToken({
 *           amount: "10", // Amount of tokens to burn
 *         })
 *       }
 *     >
 *       Burn Token
 *     </Web3Button>
 *   );
 * }
 * ```
 *
 * @param contract - Instance of a `TokenContract`
 *
 * @returns
 * A mutation object to burn tokens from the connected wallet
 * ```ts
 * const { mutateAsync, isLoading, error } = useBurnToken(contract);
 * ```
 *
 * ### options
 * The mutation function takes an object as an argument with the following properties:
 *
 * #### amount (required)
 * The amount of tokens to burn.
 *
 * The wallet initiating this transaction must have at least this amount of tokens.
 *
 * @twfeature ERC20Burnable
 * @token
 */
export function useBurnToken(contract: RequiredParam<TokenContract>) {
  const activeChainId = useSDKChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();
  const erc20 = getErc20(contract);

  return useMutation(
    (data: TokenBurnParams) => {
      const { amount } = data;
      requiredParamInvariant(contract, "contract is undefined");
      if (erc20) {
        invariant(erc20.burn, "contract does not support burn");
        return erc20.burn(amount);
      }
      invariant(false, "Smart contract is not a valid erc20 contract");
    },
    {
      onSettled: () =>
        invalidateContractAndBalances(
          queryClient,
          contractAddress,
          activeChainId,
        ),
    },
  );
}

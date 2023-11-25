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
} from "@tanstack/react-query";
import type { providers } from "ethers";
import invariant from "tiny-invariant";
import { Amount } from "@thirdweb-dev/sdk";

/** **********************/
/**     READ  HOOKS     **/
/** **********************/

/**
 * Get the total supply for this token
 *
 * @example
 * ```javascript
 * const { data: totalSupply, isLoading, error } = useTokenSupply(contract);
 * ```
 *
 * @param contract - an instance of a {@link TokenContract}
 * @returns a response object that includes the total minted supply
 * @twfeature ERC20
 * @see {@link https://portal.thirdweb.com/react/react.usetokensupply?utm_source=sdk | Documentation}
 * @beta
 */
export function useTokenSupply(contract: RequiredParam<TokenContract>) {
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
 * Get token balance for a specific wallet
 *
 * @example
 * ```javascript
 * const { data: balance, isLoading, error } = useTokenBalance(contract, "{{wallet_address}}");
 * ```
 *
 * @param contract - an instance of a {@link TokenContract}
 * @returns a response object that includes the balance of the address
 * @twfeature ERC20
 * @see {@link https://portal.thirdweb.com/react/react.usetokenbalance?utm_source=sdk | Documentation}
 * @beta
 */
export function useTokenBalance(
  contract: RequiredParam<TokenContract>,
  walletAddress: RequiredParam<WalletAddress>,
) {
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
 * Get token decimals
 *
 * @example
 * ```javascript
 * const { data: decimals, isLoading, error } = useTokenDecimals(contract);
 * ```
 *
 * @param contract - an instance of a {@link TokenContract}
 * @returns a response object that includes the decimals of the ERC20 token
 * @twfeature ERC20
 * @see {@link https://portal.thirdweb.com/react/react.usetokendecimals?utm_source=sdk | Documentation}
 * @beta
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
 * Mint tokens
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const { contract } = useContract("{{contract_address}}");
 *   const {
 *     mutate: mintTokens,
 *     isLoading,
 *     error,
 *   } = useMintToken(contract);
 *
 *   if (error) {
 *     console.error("failed to mint tokens", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => mintTokens({ to: "{{wallet_address}}", amount: 1000 })}
 *     >
 *       Mint!
 *     </button>
 *   );
 * };
 * ```
 *
 * @param contract - an instance of a {@link TokenContract}
 * @returns a mutation object that can be used to mint new tokens to the connected wallet
 * @twfeature ERC20Mintable
 * @see {@link https://portal.thirdweb.com/react/react.useminttoken?utm_source=sdk | Documentation}
 * @beta
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
 * Claim tokens to a specific wallet
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const { contract } = useContract("{{contract_address}}");
 *   const {
 *     mutate: claimTokens,
 *     isLoading,
 *     error,
 *   } = useClaimToken(contract);
 *
 *   if (error) {
 *     console.error("failed to claim tokens", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => claimTokens({ to: "{{wallet_address}}", amount: 100 })}
 *     >
 *       Claim Tokens!
 *     </button>
 *   );
 * };
 * ```
 *
 * @param contract - an instance of a {@link TokenContract}
 * @returns a mutation object that can be used to tokens to the wallet specified in the params
 * @twfeature ERC20ClaimPhasesV2 | ERC20ClaimPhasesV1 | ERC20ClaimConditionsV2 | ERC20ClaimConditionsV1
 * @see {@link https://portal.thirdweb.com/react/react.useclaimtoken?utm_source=sdk | Documentation}
 * @beta
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
 * Transfer tokens to a specific wallet
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const { contract } = useContract("{{contract_address}}");
 *   const {
 *     mutate: transferTokens,
 *     isLoading,
 *     error,
 *   } = useTransferToken(contract);
 *
 *   if (error) {
 *     console.error("failed to transfer tokens", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => transferTokens({ to: "{{wallet_address}}", amount: 1000 })}
 *     >
 *       Transfer
 *     </button>
 *   );
 * };
 * ```
 *
 * @param contract - an instance of a {@link TokenContract}
 * @returns a mutation object that can be used to transfer tokens
 * @twfeature ERC20
 * @see {@link https://portal.thirdweb.com/react/react.usetransfertoken?utm_source=sdk | Documentation}
 * @beta
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
 * Airdrop tokens to a list of wallets
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const { contract } = useContract("{{contract_address}}");
 *   const {
 *     mutate: transferBatchTokens,
 *     isLoading,
 *     error,
 *   } = useTransferToken(contract);
 *
 *   if (error) {
 *     console.error("failed to transfer batch tokens", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => transferBatchTokens([{ to: "{{wallet_address}}", amount: 1000 }, { to: "{{wallet_address}}", amount: 2000 }])}
 *     >
 *       Airdrop
 *     </button>
 *   );
 * };
 * ```
 *
 * @param contract - an instance of a {@link TokenContract}
 * @returns a mutation object that can be used to transfer batch tokens
 * @twfeature ERC20
 * @see {@link https://portal.thirdweb.com/react/react.usetransferbatchtoken?utm_source=sdk | Documentation}
 * @beta
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
 * Burn tokens
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const { contract } = useContract("{{contract_address}}");
 *   const {
 *     mutate: burnTokens,
 *     isLoading,
 *     error,
 *   } = useBurnToken(contract);
 *
 *   if (error) {
 *     console.error("failed to burn tokens", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => burnTokens({ amount: 1000 })}
 *     >
 *       Burn!
 *     </button>
 *   );
 * };
 * ```
 *
 * @param contract - an instance of a {@link TokenContract}
 * @returns a mutation object that can be used to burn tokens from the connected wallet
 * @twfeature ERC20Burnable
 * @see {@link https://portal.thirdweb.com/react/react.useburntoken?utm_source=sdk | Documentation}
 * @beta
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

import {
  requiredParamInvariant,
  RequiredParam,
} from "../../../core/query-utils/required-param";
import { useSDKChainId } from "../../providers/base";
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
  invalidateContractAndBalances,
} from "../../utils/cache-keys";
import { useQueryWithNetwork } from "../query-utils/useQueryWithNetwork";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import invariant from "tiny-invariant";

/** **********************/
/**     READ  HOOKS     **/
/** **********************/

/**
 * Use this to get a the total supply of your {@link Erc20} contract.
 *
 * @example
 * ```javascript
 * const { contract } = useContract(<ContractAddress>);
 * const { data: totalSupply, isLoading, error } = useTokenSupply(contract);
 * ```
 *
 * @param contract - an instance of a {@link TokenContract}
 * @returns a response object that incudes the total minted supply
 * @twfeature ERC20
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
 * Use this to get the balance of your {@link Erc20} contract for a given address.
 *
 * @example
 * ```javascript
 * const { contract } = useContract(<ContractAddress>);
 * const { data: balance, isLoading, error } = useTokenBalance(contract);
 * ```
 *
 * @param contract - an instance of a {@link TokenContract}
 * @returns a response object that includes the balance of the address
 * @twfeature ERC20
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
 * Use this to get the decimals of your {@link Erc20} contract for a given address.
 *
 * @example
 * ```javascript
 * const { contract } = useContract(<ContractAddress>);
 * const { data: decimals, isLoading, error } = useTokenDecimals(contract);
 * ```
 *
 * @param contract - an instance of a {@link TokenContract}
 * @returns a response object that includes the decimals of the ERC20 token
 * @twfeature ERC20
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
 * Use this to mint new tokens on your {@link Erc20} contract
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const { contract } = useContract(<ContractAddress>);
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
 *       onClick={() => mintTokens({ to: "0x...", amount: 1000 })}
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
 * @beta
 */
export function useMintToken(contract: RequiredParam<TokenContract>) {
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
 * Use this to claim tokens on your {@link Erc20}
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const { contract } = useContract(<ContractAddress>);
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
 *       onClick={() => claimTokens({ to: "0x...", amount: 100 })}
 *     >
 *       Claim Tokens!
 *     </button>
 *   );
 * };
 * ```
 *
 * @param contract - an instance of a {@link TokenContract}
 * @returns a mutation object that can be used to tokens to the wallet specificed in the params
 * @twfeature ERC20ClaimableWithConditions
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
 * Use this to transfer tokens on your {@link Erc20} contract
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const { contract } = useContract(<ContractAddress>);
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
 *       onClick={() => transferTokens({ to: "0x...", amount: 1000 })}
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

/**
 * Use this to transfer batch tokens on your {@link Erc20} contract
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const { contract } = useContract(<ContractAddress>);
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
 *       onClick={() => transferBatchTokens([{ to: "0x...", amount: 1000 }, { to: "0x...", amount: 2000 }])}
 *     >
 *       Transfer Batch
 *     </button>
 *   );
 * };
 * ```
 *
 * @param contract - an instance of a {@link TokenContract}
 * @returns a mutation object that can be used to transfer batch tokens
 * @twfeature ERC20
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
 * Use this to burn tokens on your {@link Erc20} contract
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const { contract } = useContract(<ContractAddress>);
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

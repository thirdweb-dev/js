import { useActiveChainId } from "../../Provider";
import { NFTContract, RequiredParam, WalletAddress } from "../../types";
import {
  cacheKeys,
  invalidateContractAndBalances,
} from "../../utils/cache-keys";
import { useQueryWithNetwork } from "../query-utils/useQueryWithNetwork";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ClaimCondition,
  ClaimConditionInput,
  Erc20,
  Erc1155,
} from "@thirdweb-dev/sdk";
import { BigNumberish } from "ethers";
import invariant from "tiny-invariant";

type ClaimConditionsInputParams<TContract> = TContract extends Erc1155
  ? [contract: RequiredParam<TContract>, tokenId: RequiredParam<BigNumberish>]
  : [contract: RequiredParam<TContract>];

type ClaimIneligibilityInputParams<TContract> = TContract extends Erc1155
  ? [
      contract: RequiredParam<TContract>,
      eligibilityParams: ClaimIneligibilityParameters,
      tokenId: RequiredParam<BigNumberish>,
    ]
  : [
      contract: RequiredParam<TContract>,
      eligibilityParams: ClaimIneligibilityParameters,
    ];

/**
 * The options to be passed as the second parameter to the `useClaimIneligibilityReasons` hook.
 *
 * @beta
 */
export type ClaimIneligibilityParameters = {
  // the wallet address to check claim eligibility for
  walletAddress: WalletAddress;
  // the amount of tokens to check claim eligibility for
  quantity: string | number;
};

/**
 * The params for the {@link useSetClaimConditions} hook mutation.
 *
 * @beta
 */
export type SetClaimConditionsParams = {
  phases: ClaimConditionInput[];
  reset?: boolean;
};

/** **********************/
/**     READ  HOOKS     **/
/** **********************/

/**
 * Use this to get the active claim conditon for ERC20, ERC721 or ERC1155 based contracts. They need to extend the `claimCondition` extension for this hook to work.
 *
 * @example
 * ```javascript
 * const { data: activeClaimCondition, isLoading, error } = useActiveClaimCondition(<YourERC20ContractInstance>);
 * ```
 * @example
 * ```javascript
 * const { data: activeClaimCondition, isLoading, error } = useActiveClaimCondition(<YourERC721ContractInstance>);
 * ```
 * @example
 * ```javascript
 * const { data: activeClaimCondition, isLoading, error } = useActiveClaimCondition(<YourERC1155ContractInstance>, <tokenId>);
 * ```
 *
 * @param contract - an instance of a contract that extends the ERC721 or ERC1155 spec and implements the `claimConditions` extension.
 * @param tokenId - the id of the token to fetch the claim conditions for (if the contract is an ERC1155 contract)
 * @returns a response object with the currently active claim condition
 *
 * @beta
 */
export function useActiveClaimCondition<TContract extends NFTContract | Erc20>(
  ...[contract, tokenId]: ClaimConditionsInputParams<TContract>
) {
  const contractAddress = contract?.getAddress();

  return useQueryWithNetwork(
    cacheKeys.extensions.claimConditions.getActive(contractAddress, tokenId),
    () => {
      invariant(contract, "No Contract instance provided");
      invariant(
        contract?.drop?.claim?.conditions?.getActive,
        "Contract instance does not support contract?.drop?.claim?.conditions.getActive",
      );
      if (contract.featureName === "ERC1155") {
        invariant(tokenId, "tokenId is required for ERC1155 claim conditions");
        return contract?.drop?.claim?.conditions?.getActive(tokenId);
      }
      return contract?.drop?.claim?.conditions?.getActive();
    },
    {
      // Checks that happen here:
      // 1. if the contract is based on ERC1155 contract => tokenId cannot be `undefined`
      // 2. if the contract is NOT based on ERC1155 => contract has to still be provided
      enabled:
        contract?.featureName === "ERC1155"
          ? tokenId !== undefined
          : !!contract,
    },
  );
}

/**
 * Use this to get all claim conditons for ERC20, ERC721 or ERC1155 based contracts. They need to extend the `claimCondition` extension for this hook to work.
 *
 * @example
 * ```javascript
 * const { data: claimConditions, isLoading, error } = useClaimConditions(<YourERC20ContractInstance>);
 * ```
 * @example
 * ```javascript
 * const { data: claimConditions, isLoading, error } = useClaimConditions(<YourERC721ContractInstance>);
 * ```
 * @example
 * ```javascript
 * const { data: claimConditions, isLoading, error } = useClaimConditions(<YourERC1155ContractInstance>, <tokenId>);
 * ```
 *
 * @param contract - an instance of a contract that extends the ERC721 or ERC1155 spec and implements the `claimConditions` extension.
 * @param tokenId - the id of the token to fetch the claim conditions for (if the contract is an ERC1155 contract)
 * @returns a response object with the list of claim conditions
 *
 * @beta
 */
export function useClaimConditions<TContract extends NFTContract | Erc20>(
  ...[contract, tokenId]: ClaimConditionsInputParams<TContract>
) {
  const contractAddress = contract?.getAddress();

  return useQueryWithNetwork(
    cacheKeys.extensions.claimConditions.getAll(contractAddress, tokenId),
    () => {
      invariant(contract, "No Contract instance provided");
      invariant(
        contract?.drop?.claim?.conditions?.getAll,
        "Contract instance does not support drop.claim.conditions.getAll",
      );
      if (contract.featureName === "ERC1155") {
        invariant(tokenId, "tokenId is required for ERC1155 claim conditions");
        return contract?.drop?.claim?.conditions?.getAll(tokenId);
      }
      return contract?.drop?.claim?.conditions?.getAll();
    },
    {
      // Checks that happen here:
      // 1. if the contract is based on ERC1155 contract => tokenId cannot be `undefined`
      // 2. if the contract is NOT based on ERC1155 => contract has to still be provided
      enabled:
        contract?.featureName === "ERC1155"
          ? tokenId !== undefined
          : !!contract,
    },
  );
}

/**
 * Use this to check for reasons that prevent claiming for either  ERC20, ERC721 or ERC1155 based contracts. They need to extend the `claimCondition` extension for this hook to work.
 * @example
 * ```javascript
 * const { data: activeClaimCondition, isLoading, error } = useClaimIneligibilityReasons(<YourERC20ContractInstance>, { walletAddress: <walletAddress> });
 * ```
 * @example
 * ```javascript
 * const { data: claimIneligibilityReasons, isLoading, error } = useClaimIneligibilityReasons(<YourERC721ContractInstance>, { quantity: <quantity>, walletAddress: <walletAddress> });
 * ```
 * @example
 * ```javascript
 * const { data: claimIneligibilityReasons, isLoading, error } = useClaimIneligibilityReasons(<YourERC1155ContractInstance>, { quantity: <quantity>, walletAddress: <walletAddress> }, <tokenId>);
 * ```
 *
 * @param contract - an instance of a contract that extends the  ERC20, ERC721 or ERC1155 spec and implements the `claimConditions` extension.
 * @param eligibilityParams - the parameters for the eligibility check, see: {@link ClaimIneligibilityParameters}
 * @param tokenId - the id of the token to fetch the claim conditions for (if the contract is an ERC1155 contract)
 * @returns a response object with the resons for the claim ineligibility
 *
 * @beta
 */
export function useClaimIneligibilityReasons<
  TContract extends NFTContract | Erc20,
>(...[contract, params, tokenId]: ClaimIneligibilityInputParams<TContract>) {
  const contractAddress = contract?.getAddress();

  return useQueryWithNetwork(
    cacheKeys.extensions.claimConditions.getClaimIneligibilityReasons(
      contractAddress,
      params,
      tokenId,
    ),
    () => {
      invariant(contract, "No Contract instance provided");
      invariant(
        contract?.drop?.claim?.conditions.getClaimIneligibilityReasons,
        "Contract instance does not support claimConditions.getClaimIneligibilityReasons",
      );
      if (contract.featureName === "ERC1155") {
        invariant(
          tokenId,
          "tokenId is required for ERC1155 claim ineligibility reasons",
        );
        return contract?.drop?.claim?.conditions.getClaimIneligibilityReasons(
          tokenId,
          params.quantity,
          params.walletAddress,
        );
      }
      return contract?.drop?.claim?.conditions.getClaimIneligibilityReasons(
        params.quantity,
        params.walletAddress,
      );
    },
    {
      // Checks that happen here:
      // 1. if the contract is based on ERC1155 contract => tokenId cannot be `undefined`
      // 2. if the contract is NOT based on ERC1155 => contract has to still be provided
      // 3. has a params object been passed?
      // 4. does params have an address in it?
      enabled:
        (contract?.featureName === "ERC1155"
          ? tokenId !== undefined
          : !!contract) &&
        !!params &&
        !!params.walletAddress,
    },
  );
}

/** **********************/
/**     WRITE HOOKS     **/
/** **********************/

/**
 * Use this to set claim conditions on your {@link NFTContract}
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const nftDrop = useNFTDrop(<ContractAddress>);
 *   const {
 *     mutate: setClaimConditions,
 *     isLoading,
 *     error,
 *   } = useSetClaimConditions(nftDrop);
 *
 *   if (error) {
 *     console.error("failed to set claim conditions", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => setClaimConditions({ phases: [{ price: 2, maxQuantity: 100 }] })}
 *     >
 *       Set Claim Conditions!
 *     </button>
 *   );
 * };
 * ```
 * @example
 * ```jsx
 * const Component = () => {
 *   const { contract } = useContract(<ContractAddress>);
 *   const {
 *     mutate: setClaimConditions,
 *     isLoading,
 *     error,
 *   } = useSetClaimConditions(contract?.nft);
 *
 *   if (error) {
 *     console.error("failed to set claim conditions", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => setClaimConditions({ phases: [{ price: 2, maxQuantity: 100 }] })}
 *     >
 *       Set Claim Conditions!
 *     </button>
 *   );
 * };
 * ```
 *
 * @param contract - an instance of a {@link NFTContract}
 * @returns a mutation object that can be used to set claim conditions
 * @beta
 */
export function useSetClaimConditions<TContract extends NFTContract | Erc20>(
  ...[contract, tokenId]: ClaimConditionsInputParams<TContract>
) {
  const activeChainId = useActiveChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();

  return useMutation(
    async (data: SetClaimConditionsParams) => {
      invariant(contract, "No Contract instance provided");
      const { phases, reset = false } = data;
      invariant(phases, 'No "phases" provided');
      if (contract.featureName === "ERC1155") {
        invariant(tokenId, "tokenId is required for ERC1155 claim conditions");
        return contract?.drop?.claim?.conditions.set(tokenId, phases, reset);
      }
      return contract?.drop?.claim?.conditions.set(phases, reset);
    },
    {
      onSettled: () => {
        invalidateContractAndBalances(
          queryClient,
          contractAddress,
          activeChainId,
        );
      },
    },
  );
}

/**
 * Use this to reset claim conditions on your {@link NFTContract}
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const nftDrop = useNFTDrop(<ContractAddress>);
 *   const {
 *     mutate: resetClaimConditions,
 *     isLoading,
 *     error,
 *   } = useResetClaimConditions(nftDrop);
 *
 *   if (error) {
 *     console.error("failed to reset claim conditions", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={resetClaimConditions}
 *     >
 *       Reset Claim Conditions
 *     </button>
 *   );
 * };
 * ```
 * @example
 * ```jsx
 * const Component = () => {
 *   const { contract } = useContract(<ContractAddress>);
 *   const {
 *     mutate: resetClaimConditions,
 *     isLoading,
 *     error,
 *   } = useResetClaimConditions(contract?.nft);
 *
 *   if (error) {
 *     console.error("failed to reset claim conditions", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={resetClaimConditions}
 *     >
 *       Reset Claim Conditions
 *     </button>
 *   );
 * };
 * ```
 *
 * @param contract - an instance of a {@link NFTContract}
 * @returns a mutation object that can be used to reset claim conditions
 * @beta
 */
export function useResetClaimConditions<TContract extends NFTContract | Erc20>(
  ...[contract, tokenId]: ClaimConditionsInputParams<TContract>
) {
  const activeChainId = useActiveChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();

  return useMutation(
    async () => {
      invariant(contract, "No Contract instance provided");

      const cleanConditions = (conditions: ClaimCondition[]) => {
        return conditions.map((c) => ({
          ...c,
          price: c.currencyMetadata.displayValue,
          maxQuantity: c.maxQuantity.toString(),
          quantityLimitPerTransaction: c.quantityLimitPerTransaction.toString(),
        }));
      };

      if (contract.featureName === "ERC1155") {
        invariant(tokenId, "tokenId is required for ERC1155 claim conditions");
        const claimConditions = await contract?.drop?.claim?.conditions.getAll(
          tokenId,
        );
        return contract?.drop?.claim?.conditions.set(
          tokenId,
          cleanConditions(claimConditions || []),
          true,
        );
      }

      const claimConditions = await contract?.drop?.claim?.conditions.getAll();
      return await contract?.drop?.claim?.conditions.set(
        cleanConditions(claimConditions || []),
        true,
      );
    },
    {
      onSettled: () => {
        invalidateContractAndBalances(
          queryClient,
          contractAddress,
          activeChainId,
        );
      },
    },
  );
}

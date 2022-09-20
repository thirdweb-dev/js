import { useActiveChainId } from "../../Provider";
import {
  getErcs,
  DropContract,
  RequiredParam,
  WalletAddress,
} from "../../types";
import {
  cacheKeys,
  invalidateContractAndBalances,
} from "../../utils/cache-keys";
import { useQueryWithNetwork } from "../query-utils/useQueryWithNetwork";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ClaimCondition, ClaimConditionInput } from "@thirdweb-dev/sdk";
import { BigNumberish } from "ethers";
import invariant from "tiny-invariant";

/**
 * The options to be passed as the second parameter to the {@link useClaimIneligibilityReasons}` hook.
 *
 * @beta
 */
export type ClaimIneligibilityParams = {
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
 * @twfeature
 * @beta
 */
export function useActiveClaimCondition(
  contract: RequiredParam<DropContract>,
  tokenId?: BigNumberish,
) {
  const contractAddress = contract?.getAddress();
  const { erc1155, erc721, erc20 } = getErcs(contract);

  return useQueryWithNetwork(
    cacheKeys.extensions.claimConditions.getActive(contractAddress, tokenId),
    () => {
      if (erc1155) {
        invariant(tokenId, "tokenId is required for ERC1155 claim conditions");
        return erc1155.claimConditions.getActive(tokenId);
      }
      if (erc721) {
        return erc721.claimConditions.getActive();
      }
      if (erc20) {
        return erc20.claimConditions.getActive();
      }
      return undefined;
    },
    {
      // Checks that happen here:
      // 1. if the contract is based on ERC1155 contract => tokenId cannot be `undefined`
      // 2. if the contract is NOT based on ERC1155 => we have to have either an ERC721 or ERC20 contract
      enabled: erc1155 ? tokenId !== undefined : !!erc721 || !!erc20,
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
export function useClaimConditions(
  contract: RequiredParam<DropContract>,
  tokenId?: BigNumberish,
) {
  const contractAddress = contract?.getAddress();
  const { erc1155, erc721, erc20 } = getErcs(contract);

  return useQueryWithNetwork(
    cacheKeys.extensions.claimConditions.getAll(contractAddress, tokenId),
    () => {
      if (erc1155) {
        invariant(tokenId, "tokenId is required for ERC1155 claim conditions");
        return erc1155.claimConditions.getAll(tokenId);
      }
      if (erc721) {
        return erc721.claimConditions.getAll();
      }
      if (erc20) {
        return erc20.claimConditions.getAll();
      }
      return undefined;
    },
    {
      // Checks that happen here:
      // 1. if the contract is based on ERC1155 contract => tokenId cannot be `undefined`
      // 2. if the contract is NOT based on ERC1155 => we have to have either an ERC721 or ERC20 contract
      enabled: erc1155 ? tokenId !== undefined : !!erc721 || !!erc20,
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
 * @param eligibilityParams - the parameters for the eligibility check, see: {@link ClaimIneligibilityParams}
 * @param tokenId - the id of the token to fetch the claim conditions for (if the contract is an ERC1155 contract)
 * @returns a response object with the resons for the claim ineligibility
 *
 * @beta
 */
export function useClaimIneligibilityReasons(
  contract: RequiredParam<DropContract>,
  params: ClaimIneligibilityParams,
  tokenId?: BigNumberish,
) {
  const contractAddress = contract?.getAddress();
  const { erc1155, erc721, erc20 } = getErcs(contract);

  return useQueryWithNetwork(
    cacheKeys.extensions.claimConditions.getClaimIneligibilityReasons(
      contractAddress,
      params,
      tokenId,
    ),
    () => {
      if (erc1155) {
        invariant(
          tokenId,
          "tokenId is required for ERC1155 claim ineligibility reasons",
        );
        return erc1155.claimConditions.getClaimIneligibilityReasons(
          tokenId,
          params.quantity,
          params.walletAddress,
        );
      }
      if (erc721) {
        return erc721.claimConditions.getClaimIneligibilityReasons(
          params.quantity,
          params.walletAddress,
        );
      }
      if (erc20) {
        return erc20.claimConditions.getClaimIneligibilityReasons(
          params.quantity,
          params.walletAddress,
        );
      }
      return undefined;
    },
    {
      // Checks that happen here:
      // 1. if the contract is based on ERC1155 contract => tokenId cannot be `undefined`
      // 2. if the contract is NOT based on ERC1155 => we have to have either an ERC721 or ERC20 contract
      // 3. has a params object been passed?
      // 4. does params have an address in it?
      enabled:
        (erc1155 ? tokenId !== undefined : !!erc721 || !!erc20) &&
        !!params &&
        !!params.walletAddress,
    },
  );
}

/** **********************/
/**     WRITE HOOKS     **/
/** **********************/

/**
 * Use this to set claim conditions on your {@link DropContract}
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const { contract } = useContract(<ContractAddress>);
 *   const {
 *     mutate: setClaimConditions,
 *     isLoading,
 *     error,
 *   } = useSetClaimConditions(contract);
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
 * @param contract - an instance of a {@link DropContract}
 * @returns a mutation object that can be used to set claim conditions
 * @beta
 */
export function useSetClaimConditions(
  contract: RequiredParam<DropContract>,
  tokenId?: BigNumberish,
) {
  const activeChainId = useActiveChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();
  const { erc1155, erc721, erc20 } = getErcs(contract);

  return useMutation(
    async (data: SetClaimConditionsParams) => {
      invariant(contract, "No Contract instance provided");
      const { phases, reset = false } = data;
      invariant(phases, 'No "phases" provided');
      if (erc1155) {
        invariant(tokenId, "tokenId is required for ERC1155 claim conditions");
        return erc1155.claimConditions.set(tokenId, phases, reset);
      }
      if (erc721) {
        return erc721.claimConditions.set(phases, reset);
      }
      if (erc20) {
        return erc20.claimConditions.set(phases, reset);
      }
      return undefined;
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
 * Use this to reset claim conditions on your {@link DropContract}
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const { contract } = useContract(<ContractAddress>);
 *   const {
 *     mutate: resetClaimConditions,
 *     isLoading,
 *     error,
 *   } = useResetClaimConditions(contract);
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
 * @param contract - an instance of a {@link DropContract}
 * @returns a mutation object that can be used to reset claim conditions
 * @beta
 */
export function useResetClaimConditions(
  contract: RequiredParam<DropContract>,
  tokenId?: BigNumberish,
) {
  const activeChainId = useActiveChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();
  const { erc1155, erc721, erc20 } = getErcs(contract);

  return useMutation(
    async () => {
      const cleanConditions = (conditions: ClaimCondition[]) => {
        return conditions.map((c) => ({
          ...c,
          price: c.currencyMetadata.displayValue,
          maxQuantity: c.maxQuantity.toString(),
          quantityLimitPerTransaction: c.quantityLimitPerTransaction.toString(),
        }));
      };

      if (erc1155) {
        invariant(tokenId, "tokenId is required for ERC1155 claim conditions");
        const claimConditions = await erc1155.claimConditions.getAll(tokenId);
        return erc1155.claimConditions.set(
          tokenId,
          cleanConditions(claimConditions || []),
          true,
        );
      }
      if (erc721) {
        const claimConditions = await erc721.claimConditions.getAll();
        return await erc721.claimConditions.set(
          cleanConditions(claimConditions || []),
          true,
        );
      }
      if (erc20) {
        const claimConditions = await erc20.claimConditions.getAll();
        return await erc20.claimConditions.set(
          cleanConditions(claimConditions || []),
          true,
        );
      }
      return undefined;
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

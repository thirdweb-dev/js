import {
  RequiredParam,
  requiredParamInvariant,
} from "../../../core/query-utils/required-param";
import { useSDK, useSDKChainId } from "../useSDK";
import { getErcs, DropContract, WalletAddress } from "../../types";
import {
  cacheKeys,
  invalidateContractAndBalances,
} from "../../utils/cache-keys";
import { useQueryWithNetwork } from "../query-utils/useQueryWithNetwork";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import {
  ClaimCondition,
  ClaimConditionFetchOptions,
  ClaimConditionInput,
  SnapshotEntryWithProof,
  fetchCurrencyValue,
  fetchCurrencyMetadata,
} from "@thirdweb-dev/sdk";
import type { BigNumberish, providers } from "ethers";
import { constants, utils } from "ethers";
import invariant from "tiny-invariant";

/**
 * The options to be passed as the second parameter to the {@link useClaimIneligibilityReasons} hook.
 *
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
 */
export type SetClaimConditionsParams = {
  phases: ClaimConditionInput[];
  reset?: boolean;
};

/** **********************/
/**     READ  HOOKS     **/
/** **********************/

/**
 * Get the active claim condition
 *
 * @example
 * ```javascript
 * const { data: activeClaimCondition, isLoading, error } = useActiveClaimCondition(contract);
 * ```
 *
 * @param contract - an instance of a contract that extends the ERC721, ERC1155 or ERC20 spec and implements the `claimConditions` extension.
 * @param tokenId - the id of the token to fetch the claim conditions for (if the contract is an ERC1155 contract)
 * @returns a response object with the currently active claim condition
 * @twfeature ERC20ClaimPhasesV2 | ERC20ClaimPhasesV1 | ERC20ClaimConditionsV2 | ERC20ClaimConditionsV1 | ERC721ClaimPhasesV2 | ERC721ClaimPhasesV1 | ERC721ClaimConditionsV2 | ERC721ClaimConditionsV1 | ERC1155ClaimPhasesV2 | ERC1155ClaimPhasesV1 | ERC1155ClaimConditionsV2 | ERC1155ClaimConditionsV1
 * @see {@link https://portal.thirdweb.com/react/react.useactiveclaimcondition?utm_source=sdk | Documentation}
 */
export function useActiveClaimCondition(
  contract: RequiredParam<DropContract>,
  tokenId?: BigNumberish,
  options?: ClaimConditionFetchOptions,
): UseQueryResult<ClaimCondition | undefined> {
  const contractAddress = contract?.getAddress();
  const { erc1155, erc721, erc20 } = getErcs(contract);

  return useQueryWithNetwork(
    cacheKeys.extensions.claimConditions.getActive(
      contractAddress,
      tokenId,
      options,
    ),
    () => {
      if (erc1155) {
        requiredParamInvariant(
          tokenId,
          "tokenId is required for ERC1155 claim conditions",
        );
        return erc1155.claimConditions.getActive(tokenId, options);
      }
      if (erc721) {
        return erc721.claimConditions.getActive(options);
      }
      if (erc20) {
        return erc20.claimConditions.getActive(options);
      }
      throw new Error("Contract must be ERC721, ERC1155 or ERC20");
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
 * Get claimer proofs
 *
 * @example
 * ```javascript
 * const { data: claimerProofs, isLoading, error } = useClaimerProofs(contract);
 * ```
 *
 * @param contract - an instance of a contract that extends the ERC721, ERC1155 or ERC20 spec and implements the `claimConditions` extension.
 * @param claimerAddress - the address of the claimer to fetch the claimer proofs for
 * @param tokenId - the id of the token to fetch the claimer proofs for (if the contract is an ERC1155 contract)
 * @param claimConditionId - optional the claim condition id to get the proofs for
 * @returns a response object with the snapshot for the provided address
 * @twfeature ERC20ClaimPhasesV2 | ERC20ClaimPhasesV1 | ERC20ClaimConditionsV2 | ERC20ClaimConditionsV1 | ERC721ClaimPhasesV2 | ERC721ClaimPhasesV1 | ERC721ClaimConditionsV2 | ERC721ClaimConditionsV1 | ERC1155ClaimPhasesV2 | ERC1155ClaimPhasesV1 | ERC1155ClaimConditionsV2 | ERC1155ClaimConditionsV1
 * @see {@link https://portal.thirdweb.com/react/react.useclaimerproofs?utm_source=sdk | Documentation}

 */
export function useClaimerProofs(
  contract: RequiredParam<DropContract>,
  claimerAddress: string,
  tokenId?: BigNumberish,
  claimConditionId?: BigNumberish,
) {
  const contractAddress = contract?.getAddress();
  const { erc1155, erc721, erc20 } = getErcs(contract);

  return useQueryWithNetwork(
    cacheKeys.extensions.claimConditions.getClaimerProofs(
      contractAddress,
      tokenId,
    ),
    () => {
      if (erc1155) {
        requiredParamInvariant(
          tokenId,
          "tokenId is required for ERC1155 claim conditions",
        );
        return erc1155.claimConditions.getClaimerProofs(
          tokenId,
          claimerAddress,
          claimConditionId,
        );
      }
      if (erc721) {
        return erc721.claimConditions.getClaimerProofs(
          claimerAddress,
          claimConditionId,
        );
      }
      if (erc20) {
        return erc20.claimConditions.getClaimerProofs(
          claimerAddress,
          claimConditionId,
        );
      }
      throw new Error("Contract must be ERC721, ERC1155 or ERC20");
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
 * Get all claim conditions
 *
 * @example
 * ```javascript
 * const { data: claimConditions, isLoading, error } = useClaimConditions(contract);
 * ```
 *
 * @param contract - an instance of a contract that extends the ERC721, ERC1155 or ERC20 spec and implements the `claimConditions` extension.
 * @param tokenId - the id of the token to fetch the claim conditions for (if the contract is an ERC1155 contract)
 * @returns a response object with the list of claim conditions
 * @twfeature ERC20ClaimPhasesV2 | ERC20ClaimPhasesV1 | ERC20ClaimConditionsV2 | ERC20ClaimConditionsV1 | ERC721ClaimPhasesV2 | ERC721ClaimPhasesV1 | ERC721ClaimConditionsV2 | ERC721ClaimConditionsV1 | ERC1155ClaimPhasesV2 | ERC1155ClaimPhasesV1 | ERC1155ClaimConditionsV2 | ERC1155ClaimConditionsV1
 * @see {@link https://portal.thirdweb.com/react/react.useclaimconditions?utm_source=sdk | Documentation}

 */
export function useClaimConditions(
  contract: RequiredParam<DropContract>,
  tokenId?: BigNumberish,
  options?: ClaimConditionFetchOptions,
): UseQueryResult<ClaimCondition[]> {
  const contractAddress = contract?.getAddress();
  const { erc1155, erc721, erc20 } = getErcs(contract);

  return useQueryWithNetwork(
    cacheKeys.extensions.claimConditions.getAll(
      contractAddress,
      tokenId,
      options,
    ),
    () => {
      if (erc1155) {
        requiredParamInvariant(
          tokenId,
          "tokenId is required for ERC1155 claim conditions",
        );
        return erc1155.claimConditions.getAll(tokenId, options);
      }
      if (erc721) {
        return erc721.claimConditions.getAll(options);
      }
      if (erc20) {
        return erc20.claimConditions.getAll(options);
      }
      throw new Error("Contract must be ERC721, ERC1155 or ERC20");
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
 * Get the reasons why a specific wallet can't claim
 *
 * @example
 * ```javascript
 * const { data: claimIneligibilityReasons, isLoading, error } = useClaimIneligibilityReasons(contract, { walletAddress: "{{wallet_address}}" });
 * ```
 *
 * @param contract - an instance of a contract that extends the  ERC20, ERC721 or ERC1155 spec and implements the `claimConditions` extension.
 * @param eligibilityParams - the parameters for the eligibility check, see: {@link ClaimIneligibilityParams}
 * @param tokenId - the id of the token to fetch the claim conditions for (if the contract is an ERC1155 contract)
 * @returns a response object with the reasons for the claim ineligibility
 * @twfeature ERC20ClaimPhasesV2 | ERC20ClaimPhasesV1 | ERC20ClaimConditionsV2 | ERC20ClaimConditionsV1 | ERC721ClaimPhasesV2 | ERC721ClaimPhasesV1 | ERC721ClaimConditionsV2 | ERC721ClaimConditionsV1 | ERC1155ClaimPhasesV2 | ERC1155ClaimPhasesV1 | ERC1155ClaimConditionsV2 | ERC1155ClaimConditionsV1
 * @see {@link https://portal.thirdweb.com/react/react.useclaimineligibilityreasons?utm_source=sdk | Documentation}

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
        requiredParamInvariant(
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
      throw new Error("Contract must be ERC721, ERC1155 or ERC20");
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

/**
 * Get the active claim condition for a specific wallet
 *
 * @example
 * ```javascript
 * const { data: activeClaimConditionForWallet, isLoading, error } = useActiveClaimConditionForWallet(contract, "{{wallet_address}}");
 * ```
 *
 * @param contract - an instance of a contract that extends the  ERC20, ERC721 or ERC1155 spec and implements the `claimConditions` extension.
 * @param walletAddress - the wallet address to check the active claim condition for
 * @param tokenId - the id of the token to fetch the claim conditions for (if the contract is an ERC1155 contract)
 * @returns the active claim condition for the wallet address or null if there is no active claim condition
 * @twfeature ERC20ClaimPhasesV2 | ERC20ClaimPhasesV1 | ERC20ClaimConditionsV2 | ERC20ClaimConditionsV1 | ERC721ClaimPhasesV2 | ERC721ClaimPhasesV1 | ERC721ClaimConditionsV2 | ERC721ClaimConditionsV1 | ERC1155ClaimPhasesV2 | ERC1155ClaimPhasesV1 | ERC1155ClaimConditionsV2 | ERC1155ClaimConditionsV1
 * @see {@link https://portal.thirdweb.com/react/react.useactiveclaimconditionforwallet?utm_source=sdk | Documentation}

 */
export function useActiveClaimConditionForWallet(
  contract: RequiredParam<DropContract>,
  walletAddress: RequiredParam<WalletAddress>,
  tokenId?: BigNumberish,
): UseQueryResult<ClaimCondition | null> {
  const sdk = useSDK();
  const contractAddress = contract?.getAddress();
  const { erc1155, erc721, erc20 } = getErcs(contract);
  return useQueryWithNetwork<ClaimCondition | null>(
    cacheKeys.extensions.claimConditions.useActiveClaimConditionForWallet(
      contractAddress,
      walletAddress || "_NO_WALLET_",
      tokenId,
    ),
    async () => {
      // if we do not have a walletAddress just do the same logic as basic useClaimCondition
      if (!walletAddress) {
        if (erc1155) {
          requiredParamInvariant(
            tokenId,
            "tokenId is required for ERC1155 claim conditions",
          );
          return erc1155.claimConditions.getActive(tokenId);
        }
        if (erc721) {
          return erc721.claimConditions.getActive();
        }
        if (erc20) {
          return erc20.claimConditions.getActive();
        }
        throw new Error("Contract must be ERC721, ERC1155 or ERC20");
      }
      invariant(sdk, "sdk is required");
      let activeGeneralClaimCondition: ClaimCondition | null = null;
      let claimerProofForWallet: SnapshotEntryWithProof | null = null;

      if (erc1155) {
        requiredParamInvariant(tokenId, "tokenId is required for ERC1155");
        const [cc, cp] = await Promise.all([
          erc1155.claimConditions.getActive(tokenId),
          erc1155.claimConditions.getClaimerProofs(tokenId, walletAddress),
        ]);
        activeGeneralClaimCondition = cc;
        claimerProofForWallet = cp;
      }
      if (erc721) {
        const [cc, cp] = await Promise.all([
          erc721.claimConditions.getActive(),
          erc721.claimConditions.getClaimerProofs(walletAddress),
        ]);
        activeGeneralClaimCondition = cc;
        claimerProofForWallet = cp;
      }
      if (erc20) {
        const [cc, cp] = await Promise.all([
          erc20.claimConditions.getActive(),
          erc20.claimConditions.getClaimerProofs(walletAddress),
        ]);
        activeGeneralClaimCondition = cc;
        claimerProofForWallet = cp;
      }
      // if there is no active claim condition nothing matters, return null
      if (!activeGeneralClaimCondition) {
        return null;
      }

      // if there is no claimer proof then just fall back to the active general claim condition
      if (!claimerProofForWallet) {
        return activeGeneralClaimCondition;
      }

      const { maxClaimable, currencyAddress, price } = claimerProofForWallet;

      const currencyWithOverride =
        currencyAddress || activeGeneralClaimCondition.currencyAddress;

      const currencyMetadata = await fetchCurrencyMetadata(
        sdk.getProvider(),
        currencyWithOverride,
      );

      const normalizedPrize = price
        ? price === "unlimited"
          ? constants.MaxUint256
          : utils.parseUnits(price, currencyMetadata.decimals)
        : null;

      const priceWithOverride =
        normalizedPrize || activeGeneralClaimCondition.price;

      const maxClaimableWithOverride =
        maxClaimable || activeGeneralClaimCondition.maxClaimablePerWallet;

      const currencyValueWithOverride = await fetchCurrencyValue(
        sdk.getProvider(),
        currencyWithOverride,
        priceWithOverride,
      );
      return {
        // inherit the entire claim condition
        ...activeGeneralClaimCondition,
        // overwrite all keys that could be changed based on overwrites
        maxClaimablePerWallet: maxClaimableWithOverride,
        price: priceWithOverride,
        currency: currencyWithOverride,
        currencyAddress: currencyWithOverride,
        currencyMetadata: currencyValueWithOverride,
      };
    },
    {
      // Checks that happen here:
      // 1. if the contract is based on ERC1155 contract => tokenId cannot be `undefined`
      // 2. if the contract is NOT based on ERC1155 => we have to have either an ERC721 or ERC20 contract
      enabled: erc1155 ? tokenId !== undefined : !!erc721 || !!erc20,
    },
  );
}

/** **********************/
/**     WRITE HOOKS     **/
/** **********************/

/**
 * Set claim conditions
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const { contract } = useContract("{{contract_address}}");
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
 *       onClick={() => setClaimConditions({ phases: [{ price: 2, maxClaimableSupply: 100 }] })}
 *     >
 *       Set Claim Conditions!
 *     </button>
 *   );
 * };
 * ```
 *
 * @param contract - an instance of a {@link DropContract}
 * @returns a mutation object that can be used to set claim conditions
 * @twfeature ERC20ClaimPhasesV2 | ERC20ClaimPhasesV1 | ERC20ClaimConditionsV2 | ERC20ClaimConditionsV1 | ERC721ClaimPhasesV2 | ERC721ClaimPhasesV1 | ERC721ClaimConditionsV2 | ERC721ClaimConditionsV1 | ERC1155ClaimPhasesV2 | ERC1155ClaimPhasesV1 | ERC1155ClaimConditionsV2 | ERC1155ClaimConditionsV1
 * @see {@link https://portal.thirdweb.com/react/react.usesetclaimconditions?utm_source=sdk | Documentation}

 */
export function useSetClaimConditions(
  contract: RequiredParam<DropContract>,
  tokenId?: BigNumberish,
): UseMutationResult<
  { receipt: providers.TransactionReceipt },
  unknown,
  SetClaimConditionsParams,
  unknown
> {
  const activeChainId = useSDKChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();
  const { erc1155, erc721, erc20 } = getErcs(contract);

  return useMutation(
    async (data: SetClaimConditionsParams) => {
      requiredParamInvariant(contract, "No Contract instance provided");
      const { phases, reset = false } = data;
      invariant(phases, 'No "phases" provided');
      if (erc1155) {
        requiredParamInvariant(
          tokenId,
          "tokenId is required for ERC1155 claim conditions",
        );
        return erc1155.claimConditions.set(tokenId, phases, reset);
      }
      if (erc721) {
        return erc721.claimConditions.set(phases, reset);
      }
      if (erc20) {
        return erc20.claimConditions.set(phases, reset);
      }
      throw new Error("Contract must be ERC721, ERC1155 or ERC20");
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
 * Reset claim conditions
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const { contract } = useContract("{{contract_address}}");
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
 * @twfeature ERC20ClaimPhasesV2 | ERC20ClaimPhasesV1 | ERC20ClaimConditionsV2 | ERC20ClaimConditionsV1 | ERC721ClaimPhasesV2 | ERC721ClaimPhasesV1 | ERC721ClaimConditionsV2 | ERC721ClaimConditionsV1 | ERC1155ClaimPhasesV2 | ERC1155ClaimPhasesV1 | ERC1155ClaimConditionsV2 | ERC1155ClaimConditionsV1

 */
export function useResetClaimConditions(
  contract: RequiredParam<DropContract>,
  tokenId?: BigNumberish,
) {
  const activeChainId = useSDKChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();
  const { erc1155, erc721, erc20 } = getErcs(contract);

  return useMutation(
    async () => {
      const cleanConditions = async (conditions: ClaimCondition[]) => {
        return conditions.map((c) => ({
          ...c,
          price: c.currencyMetadata.displayValue,
        }));
      };

      if (erc1155) {
        requiredParamInvariant(
          tokenId,
          "tokenId is required for ERC1155 claim conditions",
        );
        const claimConditions = await erc1155.claimConditions.getAll(tokenId, {
          withAllowList: true,
        });
        return erc1155.claimConditions.set(
          tokenId,
          await cleanConditions(claimConditions || []),
          true,
        );
      }
      if (erc721) {
        const claimConditions = await erc721.claimConditions.getAll({
          withAllowList: true,
        });
        return await erc721.claimConditions.set(
          await cleanConditions(claimConditions || []),
          true,
        );
      }
      if (erc20) {
        const claimConditions = await erc20.claimConditions.getAll({
          withAllowList: true,
        });
        return await erc20.claimConditions.set(
          await cleanConditions(claimConditions || []),
          true,
        );
      }
      throw new Error("Contract must be ERC721, ERC1155 or ERC20");
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

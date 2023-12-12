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
  /**
   * An array of phases that occur in chronological order.
   */
  phases: ClaimConditionInput[];
  /**
   * A boolean value that determines whether to reset the claim conditions or to keep the existing state.
   * By resetting them, any previous claims that were made will be ignored by the claim condition restrictions.
   *
   * For example, if you had a limit of 1 token per wallet, and a user claimed a token, then you reset the claim conditions, that user will be able to claim another token.
   *
   * Default value is `false`.
   *
   */
  reset?: boolean;
};

/** **********************/
/**     READ  HOOKS     **/
/** **********************/

/**
 * Hook for getting the active claim condition for a given drop contract.
 *
 * Available for contracts that implement the claim conditions interface;
 * such as [NFT Drop](https://thirdweb.com/thirdweb.eth/DropERC721), [Edition Drop](https://thirdweb.com/thirdweb.eth/DropERC1155), and [Token Drop](https://thirdweb.com/thirdweb.eth/DropERC20).
 *
 * @example
 * ```javascript
 * import { useActiveClaimCondition, useContract } from "@thirdweb-dev/react";
 *
 * function App() {
 *   // Contract can be any contract that implements claim conditions.
 *   // Including ERC721, ERC1155, and ERC20 drop contracts.
 *
 *   const { contract } = useContract(contractAddress);
 *   const { data, isLoading, error } = useActiveClaimCondition(contract);
 * }
 * ```
 *
 * @param contract - an instance of a contract that extends the ERC721, ERC1155 or ERC20 spec and implements the `claimConditions` extension.
 *
 * @param tokenId -
 * When using the hook with ERC1155 contracts such as the Edition Drop, pass the `tokenId` as the second parameter; as each token can have unique claim conditions.
 *
 * Pass `undefined`, or leave this field out if you are using ERC721 or ERC20 drop contracts.
 *
 * ### Example
 *
 * ```tsx
 * import { useActiveClaimCondition, useContract } from "@thirdweb-dev/react";
 *
 * // Your smart contract address
 * const contractAddress = "{{contract_address}}";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress);
 *
 *   // "data" now includes a "snapshot" property that contains the allowlist.
 *   const { data, isLoading, error } = useActiveClaimCondition(
 *     contract,
 *     0, // Token ID required for ERC1155 contracts here.
 *   );
 * }
 * ```
 *
 * @param options - additional options to pass to the claim condition fetch
 *
 * ### withAllowlist
 *
 * By default, the hook will not include the allowlist or "snapshot" in the returned data. To include the allowlist in the returned data, pass `withAllowlist: true` in options object.
 *
 * This will add a snapshot property to the returned data, which contains the allowlist in an array.
 *
 * ```tsx
 * import { useActiveClaimCondition, useContract } from "@thirdweb-dev/react";
 *
 * // Your smart contract address
 * const contractAddress = "{{contract_address}}";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress);
 *
 *   // "data" now includes a "snapshot" property that contains the allowlist.
 *   const { data, isLoading, error } = useActiveClaimCondition(
 *     contract,
 *     undefined, // Token ID required for ERC1155 contracts here.
 *     {
 *       withAllowlist: true,
 *     },
 *   );
 * }
 * ```
 *
 * @returns a response object with the currently active claim condition
 *
 * @twfeature ERC20ClaimPhasesV2 | ERC20ClaimPhasesV1 | ERC20ClaimConditionsV2 | ERC20ClaimConditionsV1 | ERC721ClaimPhasesV2 | ERC721ClaimPhasesV1 | ERC721ClaimConditionsV2 | ERC721ClaimConditionsV1 | ERC1155ClaimPhasesV2 | ERC1155ClaimPhasesV1 | ERC1155ClaimConditionsV2 | ERC1155ClaimConditionsV1
 * @tags claim-conditions
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
 * Hook to get the claimer proofs for an address for [ERC20](https://portal.thirdweb.com/solidity/base-contracts/erc20drop), [ERC721](https://portal.thirdweb.com/solidity/base-contracts/erc721drop), and [ERC1155](https://portal.thirdweb.com/solidity/base-contracts/erc1155drop) drop contracts.
 *
 * A claimer proof is a set of data about a claimer's claim condition, including the claimer's address, the claimer's proof, and the claimer's max claimable amount, price, and currency address.
 *
 * This is available for available for contracts that implement the claim conditions interface; such as [NFT Drop](https://thirdweb.com/thirdweb.eth/DropERC721), [Edition Drop](https://thirdweb.com/thirdweb.eth/DropERC1155), and [Token Drop](https://thirdweb.com/thirdweb.eth/DropERC20).
 *
 * @example
 * ```javascript
 * import { useClaimerProofs, useContract } from "@thirdweb-dev/react";
 *
 * // Your smart contract address
 * const contractAddress = "{{contract_address}}";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress);
 *
 *   const {
 *     data: proof,
 *     isLoading,
 *     error,
 *   } = useClaimerProofs(contract, "{{claimer_address}}");
 * }
 * ```
 *
 * @param contract - an instance of a contract that extends the ERC721, ERC1155 or ERC20 spec and implements the `claimConditions` extension.
 *
 * @param claimerAddress -
 * This is the address of the user you want to get the proof for.
 *
 * Likely, you will want to check proofs of the currently connected wallet address. You can use the `useAddress` hook to get this value.
 *
 * @param tokenId -
 * When using the hook with ERC1155 contracts, pass the `tokenId`; as each token can have unique claim conditions.
 *
 * Pass `undefined`, or leave this field out if you are using ERC721 or ERC20 drop contracts.
 *
 * @param claimConditionId -
 * This is the ID of the claim condition you want to get the proof for.
 *
 * @returns a response object with the snapshot for the provided address
 *
 * @tags claim-conditions
 * @twfeature ERC20ClaimPhasesV2 | ERC20ClaimPhasesV1 | ERC20ClaimConditionsV2 | ERC20ClaimConditionsV1 | ERC721ClaimPhasesV2 | ERC721ClaimPhasesV1 | ERC721ClaimConditionsV2 | ERC721ClaimConditionsV1 | ERC1155ClaimPhasesV2 | ERC1155ClaimPhasesV1 | ERC1155ClaimConditionsV2 | ERC1155ClaimConditionsV1
 */
export function useClaimerProofs(
  contract: RequiredParam<DropContract>,
  claimerAddress: string,
  tokenId?: BigNumberish,
  claimConditionId?: BigNumberish,
): UseQueryResult<
  {
    address: string;
    proof: string[];
    maxClaimable: string;
    price?: string | undefined;
    currencyAddress?: string | undefined;
  } | null,
  unknown
> {
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
 * Hook for fetching all claim conditions for a given drop contract.
 *
 * This is available for available for contracts that implement the claim conditions interface; such as [NFT Drop](https://thirdweb.com/thirdweb.eth/DropERC721), [Edition Drop](https://thirdweb.com/thirdweb.eth/DropERC1155), and [Token Drop](https://thirdweb.com/thirdweb.eth/DropERC20).
 *
 * @example
 * ```javascript
 * import { useClaimConditions, useContract } from "@thirdweb-dev/react";
 *
 * // Your smart contract address
 * const contractAddress = "{{contract_address}}";
 *
 * function App() {
 *   // Contract can be any contract that implements claim conditions.
 *   // Including ERC721, ERC1155, and ERC20 drop contracts.
 *
 *   const { contract } = useContract(contractAddress);
 *   const { data, isLoading, error } = useClaimConditions(contract);
 * }
 * ```
 *
 * @param contract - an instance of a contract that extends the ERC721, ERC1155 or ERC20 spec and implements the `claimConditions` extension.
 *
 * @param tokenId -
 * When using the hook with ERC1155 contracts, pass the `tokenId` parameter; as each token can have unique claim conditions.
 *
 * Pass `undefined`, or leave this field out if you are using ERC721 or ERC20 drop contracts.
 *
 * ```tsx
 * import { useClaimConditions, useContract } from "@thirdweb-dev/react";
 *
 * // Your smart contract address
 * const contractAddress = "{{contract_address}}";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress);
 *
 *   const { data, isLoading, error } = useClaimConditions(
 *     contract,
 *     0, // Token ID required for ERC1155 contracts here.
 *   );
 * }
 * ```
 *
 * @param options - additional options to pass to the claim condition fetch
 *
 * ### withAllowlist
 *
 * By default, the hook will not include the allowlist in the returned data. To include the allowlist in the returned data, set the `withAllowlist` option to true.
 *
 * This will add a `snapshot` property to the returned data, which contains the allowlist in an array.
 *
 * ```tsx
 * import { useClaimConditions, useContract } from "@thirdweb-dev/react";
 *
 * // Your smart contract address
 * const contractAddress = "{{contract_address}}";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress);
 *
 *   // "data" now includes a "snapshot" property that contains the allowlist.
 *   const { data, isLoading, error } = useClaimConditions(
 *     contract,
 *     undefined, // Token ID required for ERC1155 contracts here.
 *     {
 *       withAllowlist: true,
 *     },
 *   );
 * }
 * ```
 *
 * @returns a response object with the list of claim conditions
 *
 * @twfeature ERC20ClaimPhasesV2 | ERC20ClaimPhasesV1 | ERC20ClaimConditionsV2 | ERC20ClaimConditionsV1 | ERC721ClaimPhasesV2 | ERC721ClaimPhasesV1 | ERC721ClaimConditionsV2 | ERC721ClaimConditionsV1 | ERC1155ClaimPhasesV2 | ERC1155ClaimPhasesV1 | ERC1155ClaimConditionsV2 | ERC1155ClaimConditionsV1
 * @tags claim-conditions
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
 * Hook for fetching the reasons a wallet is not eligible to claim tokens from a drop, if any.
 *
 * This is available for available for contracts that implement the claim conditions interface; such as [NFT Drop](https://thirdweb.com/thirdweb.eth/DropERC721), [Edition Drop](https://thirdweb.com/thirdweb.eth/DropERC1155), and [Token Drop](https://thirdweb.com/thirdweb.eth/DropERC20).
 *
 * @example
 * ```javascript
 * import { useClaimIneligibilityReasons, useContract } from "@thirdweb-dev/react";
 *
 * // Your smart contract address
 * const contractAddress = "{{contract_address}}";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress);
 *   const { data, isLoading, error } = useClaimIneligibilityReasons(contract, {
 *     walletAddress: "{{wallet_address}}", // Use useAddress hook to get the user's wallet address
 *     quantity: 1, // Quantity to check eligibility for
 *   });
 * }
 * ```
 *
 * @param contract - an instance of a contract that extends the  ERC20, ERC721 or ERC1155 spec and implements the `claimConditions` extension.
 *
 * @param eligibilityParams -
 * The conditions to check eligibility for. The `walletAddress` and `quantity` properties are required.
 *
 * Use the `useAddress` hook to get the connected wallet address.
 *
 * @param tokenId -
 * When using ERC1155 contracts, provide a third argument to specify the token ID.
 *
 * ### Example
 *
 * ```tsx
 * * import { useClaimIneligibilityReasons, useContract } from "@thirdweb-dev/react";
 *
 * // Your smart contract address
 * const contractAddress = "{{contract_address}}";
 *
 * const tokenId = 1;
 *
 * function App() {
 *   const { contract } = useContract(contractAddress);
 *   const { data, isLoading, error } = useClaimIneligibilityReasons(
 *     contract,
 *     {
 *       walletAddress: "{{wallet_address}}",
 *       quantity: 1,
 *     },
 *     tokenId,
 *   );
 * }
 * ```
 *
 * @returns
 * The hook's data property, once loaded, contains an array of ClaimEligibility strings, which may be empty.
 *
 * For example, if the user is not in the allowlist, this hook will return ["This address is not on the allowlist."].
 *
 * If the user is eligible to claim tokens, the hook will return an empty array.
 *
 * @tags claim-conditions
 * @twfeature ERC20ClaimPhasesV2 | ERC20ClaimPhasesV1 | ERC20ClaimConditionsV2 | ERC20ClaimConditionsV1 | ERC721ClaimPhasesV2 | ERC721ClaimPhasesV1 | ERC721ClaimConditionsV2 | ERC721ClaimConditionsV1 | ERC1155ClaimPhasesV2 | ERC1155ClaimPhasesV1 | ERC1155ClaimConditionsV2 | ERC1155ClaimConditionsV1
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
 * Hook for getting the active claim condition on a drop contract for a specific wallet address.
 *
 * Each wallet address can have unique claim conditions at any given time. This hook allows you to get the active claim condition for a specific wallet address at this time.
 *
 * This is available for available for contracts that implement the claim conditions interface; such as [NFT Drop](https://thirdweb.com/thirdweb.eth/DropERC721), [Edition Drop](https://thirdweb.com/thirdweb.eth/DropERC1155), and [Token Drop](https://thirdweb.com/thirdweb.eth/DropERC20).
 *
 * - Returns the claim condition specific to the wallet address if found in the claimer snapshot.
 * - Returns the default claim condition on the contract if the address is not found in the claimer snapshot.
 * - Populates the error field if there is no active claim condition on the contract.
 *
 * @example
 * ```javascript
 * import {
 *   useActiveClaimConditionForWallet,
 *   useContract,
 *   useAddress,
 * } from "@thirdweb-dev/react";
 *
 * // Your smart contract address
 * const contractAddress = "{{contract_address}}";
 *
 * function App() {
 *   // Contract can be any contract that implements claim conditions.
 *   // Including ERC721, ERC1155, and ERC20 drop contracts.
 *   const address = useAddress();
 *   const { contract } = useContract(contractAddress);
 *   const { data, isLoading, error } = useActiveClaimConditionForWallet(
 *     contract,
 *     address,
 *   );
 * }
 * ```
 *
 * @param contract - an instance of a contract that extends the  ERC20, ERC721 or ERC1155 spec and implements the `claimConditions` extension.
 *
 * @param walletAddress -
 * the wallet address to check the active claim condition for. You can use the `useAddress` hook to get the currently connected wallet's address.
 *
 * @param tokenId -
 * When using the hook with ERC1155 contracts, pass the `tokenId` as the third parameter; as each token can have unique claim conditions.
 *
 * Pass `undefined`, or leave this field out if you are using ERC721 or ERC20 drop contracts.
 *
 * @returns the active claim condition for the wallet address or `null` if there is no active claim condition
 *
 * @twfeature ERC20ClaimPhasesV2 | ERC20ClaimPhasesV1 | ERC20ClaimConditionsV2 | ERC20ClaimConditionsV1 | ERC721ClaimPhasesV2 | ERC721ClaimPhasesV1 | ERC721ClaimConditionsV2 | ERC721ClaimConditionsV1 | ERC1155ClaimPhasesV2 | ERC1155ClaimPhasesV1 | ERC1155ClaimConditionsV2 | ERC1155ClaimConditionsV1
 * @tags claim-conditions
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
 * Hook for setting claim conditions on a drop contract.
 *
 * This is available for available for contracts that implement the claim conditions interface; such as [NFT Drop](https://thirdweb.com/thirdweb.eth/DropERC721), [Edition Drop](https://thirdweb.com/thirdweb.eth/DropERC1155), and [Token Drop](https://thirdweb.com/thirdweb.eth/DropERC20).
 *
 * When using an ERC1155 contract, you must also provide the token ID of the NFT you want to set claim conditions on as the second parameter to the hook.
 *
 * @example
 * ```tsx
 * import {
 *   useSetClaimConditions,
 *   useContract,
 *   Web3Button,
 * } from "@thirdweb-dev/react";
 *
 * // Your smart contract address
 * const contractAddress = "{{contract_address}}";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress);
 *   const {
 *     mutateAsync: setClaimConditions,
 *     isLoading,
 *     error,
 *   } = useSetClaimConditions(contract);
 *
 *   const claimConditions = {
 *     phases: [
 *       {
 *         metadata: {
 *           name: "Phase 1", // The name of the phase
 *         },
 *         currencyAddress: "0x...", // The address of the currency you want users to pay in
 *         price: 1, // The price of the token in the currency specified above
 *         maxClaimablePerWallet: 1, // The maximum number of tokens a wallet can claim
 *         maxClaimableSupply: 100, // The total number of tokens that can be claimed in this phase
 *         startTime: new Date(), // When the phase starts (i.e. when users can start claiming tokens)
 *         waitInSeconds: 60 * 60 * 24 * 7, // The period of time users must wait between repeat claims
 *         snapshot: [
 *           {
 *             address: "0x...", // The address of the wallet
 *             currencyAddress: "0x...", // Override the currency address this wallet pays in
 *             maxClaimable: 5, // Override the maximum number of tokens this wallet can claim
 *             price: 0.5, // Override the price this wallet pays
 *           },
 *         ],
 *         merkleRootHash: "0x...", // The merkle root hash of the snapshot
 *       },
 *     ],
 *   }
 *
 *   return (
 *     <Web3Button
 *       contractAddress={contractAddress}
 *       action={() => setClaimConditions(claimConditions)}
 *     >
 *       Set Claim Conditions
 *     </Web3Button>
 *   );
 * }
 * ```
 *
 * @param contract - an instance of a {@link DropContract}
 * @returns
 * a mutation object that can be used to set claim conditions
 *
 * The mutation function takes in two arguments:
 * 1. `reset` - A boolean that determines whether to reset the claim conditions. This means you reset any previous claim conditions that existed and allow users to claim again as if the drop had just started.
 * 2. `phases` - An array of claim phases that occur in chronological order. You can only have one phase occur at a time. All properties of a phase are optional, with the default being a free, open, unlimited claim, in the native currency, starting immediately.
 *
 * ---
 *
 * ### reset (optional)
 *
 * A boolean value that determines whether to reset the claim conditions or to keep the existing state.
 *
 * By resetting them, any previous claims that were made will be ignored by the claim condition restrictions.
 *
 * For example, if you had a limit of 1 token per wallet, and a user claimed a token, then you reset the claim conditions, that user will be able to claim another token.
 *
 * Default value is `false`.
 *
 * ---
 *
 * ### phases (required)
 *
 * Provide an array of phases that occur in chronological order. All properties of a phase are optional and are described below:
 *
 * #### metadata
 *
 * An object representing the metadata of the phase. This is only for display purposes in the dashboard and isn’t used elsewhere.
 *
 * ```js
 * {
 *   name: string;
 * }
 * ```
 *
 * #### currencyAddress
 *
 * The address of the currency you want users to pay in.
 *
 * This can be any ERC20 token value. If you want users to pay in the native currency (e.g. Ether on Ethereum), you can import the `NATIVE_TOKEN_ADDRESS` constant from `@thirdweb-dev/sdk`. The default value is `NATIVE_TOKEN_ADDRESS`.
 *
 * #### price
 *
 * The price per token in the currency specified above. The default value is `0`.
 *
 * #### maxClaimablePerWallet
 *
 * The maximum number of tokens a wallet can claim. The default value is `"unlimited"`
 *
 * #### maxClaimableSupply
 *
 * The total number of tokens that can be claimed in this phase.
 *
 * For example, if you lazy mint 1000 tokens and set the `maxClaimableSupply` to 100, then only 100 tokens will be claimable in this phase, leaving 900 tokens to be claimed in the next phases (if you have any).
 *
 * This is useful for "early bird" use cases, where you allow users to claim a limited number of tokens at a discounted price during the first X amount of time.
 *
 * #### startTime
 *
 * When the phase starts (i.e. when users can start claiming tokens).
 *
 * The default value is `"immediately"`.
 *
 * #### waitInSeconds
 *
 * The amount of time between claims a wallet must wait before they can claim again.
 *
 * The default value is `0`, meaning users can claim again immediately after claiming.
 *
 * #### snapshot
 *
 * A list of wallets that you want to override the default claim conditions for.
 *
 * Wallet addresses within this list can be set to pay in a different currency, have a different price, and have a different maximum claimable amount.
 *
 * ```jsx
 * {
 *   address: string;
 *   currencyAddress?: string;
 *   maxClaimable?: number;
 *   price?: number;
 * }
 * ```
 *
 * [Learn more about improving claim conditions](https://blog.thirdweb.com/announcing-improved-claim-conditions/)
 *
 * #### merkleRootHash
 *
 * If you want to provide your own merkle tree for your snapshot, provide the merkle root hash here. This is only recommended for advanced use cases.
 *
 * @tags claim-conditions
 * @twfeature ERC20ClaimPhasesV2 | ERC20ClaimPhasesV1 | ERC20ClaimConditionsV2 | ERC20ClaimConditionsV1 | ERC721ClaimPhasesV2 | ERC721ClaimPhasesV1 | ERC721ClaimConditionsV2 | ERC721ClaimConditionsV1 | ERC1155ClaimPhasesV2 | ERC1155ClaimPhasesV1 | ERC1155ClaimConditionsV2 | ERC1155ClaimConditionsV1
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

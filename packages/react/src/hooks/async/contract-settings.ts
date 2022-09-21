import { useSDKChainId } from "../../providers/base";
import { RequiredParam, WalletAddress } from "../../types";
import {
  cacheKeys,
  invalidateContractAndBalances,
} from "../../utils/cache-keys";
import { useQueryWithNetwork } from "../query-utils/useQueryWithNetwork";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  CustomContractMetadata,
  ValidContractInstance,
} from "@thirdweb-dev/sdk";
import invariant from "tiny-invariant";

// primary sales

/**
 *
 * @example
 * ```jsx
 * const { data: recipient, isLoading, error } = usePrimarySalesRecipient(SmartContract);
 * ```
 *
 * Use this to get the primary sales recipient of your {@link SmartContract}
 * @param contract - an instance of a {@link SmartContract}
 * @returns the wallet address of the primary sales recipient
 * @beta
 */
export function usePrimarySaleRecipient(
  contract: RequiredParam<ValidContractInstance>,
) {
  const contractAddress = contract?.getAddress();
  return useQueryWithNetwork(
    cacheKeys.extensions.sales.getRecipient(contractAddress),
    () => {
      invariant(contract, "No contract provided");
      invariant(
        "sales" in contract && contract.sales,
        "Contract does not support primarySale",
      );
      return contract.sales.getRecipient();
    },
    { enabled: !!contract || !!contractAddress },
  );
}

/**
 * Use this to update the primary sales recipient of your {@link SmartContract}
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const {
 *     mutate: updatePrimarySalesRecipient,
 *     isLoading,
 *     error,
 *   } = useUpdatePrimarySaleRecipient(SmartContract);
 *
 *   if (error) {
 *     console.error("failed to update recipient", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => updatePrimarySalesRecipient({ newRecipient: "0x123" })}
 *     >
 *       Update Recipient
 *     </button>
 *   );
 * };
 * ```
 *
 * @param contract - an instance of a {@link SmartContract}
 * @returns a mutation object that can be used to update the primary sales recipient
 * @beta
 */
export function useUpdatePrimarySaleRecipient(
  contract: RequiredParam<ValidContractInstance>,
) {
  const queryClient = useQueryClient();
  const contractAddress = contract?.getAddress();
  const activeChainId = useSDKChainId();
  return useMutation(
    (newRecipient: WalletAddress) => {
      invariant(contract, "No contract provided");
      invariant(
        "sales" in contract && contract.sales,
        "Contract does not support primarySale",
      );
      return contract.sales.setRecipient(newRecipient);
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

// end prinary sales

// royalties

/**
 * Use this to get the royalty settings of your {@link SmartContract}
 *
 * @example
 * ```jsx
 * const { data: settings, isLoading, error } = useRoyaltySettings(SmartContract);
 * ```
 *
 * @param contract - an instance of a {@link SmartContract}
 * @returns an object containing recipient address and the royalty basis points
 * @beta
 */
export function useRoyaltySettings(
  contract: RequiredParam<ValidContractInstance>,
) {
  const contractAddress = contract?.getAddress();
  return useQueryWithNetwork(
    cacheKeys.extensions.royalties.getDefaultRoyaltyInfo(contractAddress),
    () => {
      invariant(contract, "No contract provided");
      invariant(
        "royalties" in contract && contract.royalties,
        "Contract does not support royalties",
      );
      return contract.royalties.getDefaultRoyaltyInfo();
    },
    { enabled: !!contract || !!contractAddress },
  );
}

/**
 * Use this to update the royalty settings of your {@link SmartContract}
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const {
 *     mutate: updateRoyaltySettings,
 *     isLoading,
 *     error,
 *   } = useUpdateRoyaltySettings(SmartContract);
 *
 *   if (error) {
 *     console.error("failed to update royalty settings", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => updateRoyaltySettings({ updatePayload: { fee_recipient: "0x123", seller_fee_basis_points: 5_00 } })}
 *     >
 *       Update Royalty Settings
 *     </button>
 *   );
 * };
 * ```
 *
 * @param contract - an instance of a {@link SmartContract}
 * @returns a mutation object that can be used to update the royalty settings
 * @beta
 */
export function useUpdateRoyaltySettings(
  contract: RequiredParam<ValidContractInstance>,
) {
  const queryClient = useQueryClient();
  const contractAddress = contract?.getAddress();
  const activeChainId = useSDKChainId();
  return useMutation(
    (updatePayload: {
      seller_fee_basis_points?: number;
      fee_recipient?: WalletAddress;
    }) => {
      invariant(contract, "No contract provided");
      invariant(
        "royalties" in contract && contract.royalties,
        "Contract does not support royalties",
      );
      return contract.royalties.setDefaultRoyaltyInfo(updatePayload);
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

// end royalties

// platformFees

/**
 * Use this to get the platform fees settings of your {@link SmartContract}
 *
 * @example
 * ```jsx
 * const { data: platformFees, isLoading, error } = usePlatformFees(SmartContract);
 * ```
 *
 * @param contract - an instance of a {@link SmartContract}
 * @returns an object containing the platform fee basis points and the fee recipient address
 * @beta
 */
export function usePlatformFees(
  contract: RequiredParam<ValidContractInstance>,
) {
  const contractAddress = contract?.getAddress();
  return useQueryWithNetwork(
    cacheKeys.extensions.platformFees.get(contractAddress),
    () => {
      invariant(contract, "No contract provided");
      invariant(
        "platformFees" in contract && contract.platformFees,
        "Contract does not support platformFees",
      );
      return contract.platformFees.get();
    },
    { enabled: !!contract || !!contractAddress },
  );
}

/**
 * Use this to update the platform fees settings of your {@link SmartContract}
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const {
 *     mutate: updatePlatformFees,
 *     isLoading,
 *     error,
 *   } = useUpdatePlatformFees(SmartContract);
 *
 *   if (error) {
 *     console.error("failed to update platform fees", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => updatePlatformFees({ updatePayload: { fee_recipient: "0x123", platform_fee_basis_points: 5_00 } })}
 *     >
 *       Update Platform fees
 *     </button>
 *   );
 * };
 * ```
 * @param contract - an instance of a {@link SmartContract}
 * @returns a mutation object that can be used to update the platform fees settings
 * @beta
 */
export function useUpdatePlatformFees(
  contract: RequiredParam<ValidContractInstance>,
) {
  const queryClient = useQueryClient();
  const contractAddress = contract?.getAddress();
  const activeChainId = useSDKChainId();
  return useMutation(
    (updatePayload: {
      platform_fee_basis_points?: number;
      fee_recipient?: WalletAddress;
    }) => {
      invariant(contract, "No contract provided");
      invariant(
        "platformFees" in contract && contract.platformFees,
        "Contract does not support platformFees",
      );
      return contract.platformFees.set(updatePayload);
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

// end platformFees

// metadata

/**
 * Use this to get the metadata of your {@link SmartContract}
 *
 * @example
 * ```jsx
 * const { data: metadata, isLoading, error } = useMetadata(SmartContract);
 * ```
 *
 * @param contract - an instance of a {@link SmartContract}
 * @returns a {@link CustomContractMetadata} object containing the metadata
 * @beta
 */
export function useMetadata(contract: RequiredParam<ValidContractInstance>) {
  const contractAddress = contract?.getAddress();
  return useQueryWithNetwork(
    cacheKeys.extensions.metadata.get(contractAddress),
    () => {
      invariant(contract, "No contract provided");
      invariant(
        "metadata" in contract && contract.metadata,
        "Contract does not support metadata",
      );
      return contract.metadata.get() as Promise<CustomContractMetadata>;
    },
    { enabled: !!contract || !!contractAddress },
  );
}

/**
 * Use this to update the metadata of your {@link SmartContract}
 * @example
 * ```jsx
 * const Component = () => {
 *   const {
 *     mutate: updateMetadata,
 *     isLoading,
 *     error,
 *   } = useUpdateMetadata(SmartContract);
 *
 *   if (error) {
 *     console.error("failed to update metadata", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => updateMetadata({ updatePayload: { name: "My Contract", description: "This is my contract" } })}
 *     >
 *       Update Metadata
 *     </button>
 *   );
 * };
 * ```
 * @param contract - an instance of a {@link SmartContract}
 * @returns a mutation object that can be used to update the metadata
 * @beta
 */
export function useUpdateMetadata(
  contract: RequiredParam<ValidContractInstance>,
) {
  const queryClient = useQueryClient();
  const contractAddress = contract?.getAddress();
  const activeChainId = useSDKChainId();
  return useMutation(
    (updatePayload: CustomContractMetadata) => {
      invariant(contract, "No contract provided");
      invariant(
        "metadata" in contract && contract.metadata,
        "Contract does not support metadata",
      );
      return contract.metadata.update(updatePayload);
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

// end metadata

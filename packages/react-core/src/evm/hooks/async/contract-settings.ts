import {
  RequiredParam,
  requiredParamInvariant,
} from "../../../core/query-utils/required-param";
import { useSDKChainId } from "../useSDK";
import { WalletAddress } from "../../types";
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
import type {
  CustomContractMetadata,
  ValidContractInstance,
} from "@thirdweb-dev/sdk";
import type { providers } from "ethers";
import invariant from "tiny-invariant";

// primary sales

/**
 * Get the primary sale recipient
 *
 * @example
 * ```jsx
 * const { data: primarySaleRecipient, isLoading, error } = usePrimarySalesRecipient(contract);
 * ```
 *
 * Use this to get the primary sales recipient of your {@link SmartContract}
 * @param contract - an instance of a {@link SmartContract}
 * @returns the wallet address of the primary sales recipient
 * @twfeature PrimarySale
 * @see {@link https://portal.thirdweb.com/react/react.useprimarysalerecipient?utm_source=sdk | Documentation}

 */
export function usePrimarySaleRecipient(
  contract: RequiredParam<ValidContractInstance>,
) {
  const contractAddress = contract?.getAddress();
  return useQueryWithNetwork(
    cacheKeys.extensions.sales.getRecipient(contractAddress),
    () => {
      requiredParamInvariant(contract, "No contract provided");
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
 * Set the primary sale recipient
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const { contract } = useContract("{{contract_address}}");
 *   const {
 *     mutate: updatePrimarySalesRecipient,
 *     isLoading,
 *     error,
 *   } = useUpdatePrimarySaleRecipient(contract);
 *
 *   if (error) {
 *     console.error("failed to update recipient", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => updatePrimarySalesRecipient({ newRecipient: "{{wallet_address}}" })}
 *     >
 *       Update Recipient
 *     </button>
 *   );
 * };
 * ```
 *
 * @param contract - an instance of a {@link SmartContract}
 * @returns a mutation object that can be used to update the primary sales recipient
 * @twfeature PrimarySale
 * @see {@link https://portal.thirdweb.com/react/react.useupdateprimarysalerecipient?utm_source=sdk | Documentation}

 */
export function useUpdatePrimarySaleRecipient(
  contract: RequiredParam<ValidContractInstance>,
): UseMutationResult<
  {
    receipt: providers.TransactionReceipt;
  },
  unknown,
  string,
  unknown
> {
  const queryClient = useQueryClient();
  const contractAddress = contract?.getAddress();
  const activeChainId = useSDKChainId();
  return useMutation(
    (newRecipient: WalletAddress) => {
      requiredParamInvariant(contract, "No contract provided");
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

// end primary sales

// royalties

/**
 * Get the royalty recipient and fee
 *
 * @example
 * ```jsx
 * const { data: settings, isLoading, error } = useRoyaltySettings(contract);
 * ```
 *
 * @param contract - an instance of a {@link SmartContract}
 * @returns an object containing recipient address and the royalty basis points
 * @twfeature Royalty
 * @see {@link https://portal.thirdweb.com/react/react.useroyaltysettings?utm_source=sdk | Documentation}

 */
export function useRoyaltySettings(
  contract: RequiredParam<ValidContractInstance>,
) {
  const contractAddress = contract?.getAddress();
  return useQueryWithNetwork(
    cacheKeys.extensions.royalties.getDefaultRoyaltyInfo(contractAddress),
    () => {
      requiredParamInvariant(contract, "No contract provided");
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
 * Set the royalty recipient and fee
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const { contract } = useContract("{{contract_address}}");
 *   const {
 *     mutate: updateRoyaltySettings,
 *     isLoading,
 *     error,
 *   } = useUpdateRoyaltySettings(contract);
 *
 *   if (error) {
 *     console.error("failed to update royalty settings", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => updateRoyaltySettings({ updatePayload: { fee_recipient: "{{wallet_address}}", seller_fee_basis_points: 5_00 } })}
 *     >
 *       Update Royalty Settings
 *     </button>
 *   );
 * };
 * ```
 *
 * @param contract - an instance of a {@link SmartContract}
 * @returns a mutation object that can be used to update the royalty settings
 * @twfeature Royalty
 * @see {@link https://portal.thirdweb.com/react/react.useupdateroyaltysettings?utm_source=sdk | Documentation}

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
      requiredParamInvariant(contract, "No contract provided");
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
 * Get the platform fee recipient and basis points
 *
 * @example
 * ```jsx
 * const { data: platformFees, isLoading, error } = usePlatformFees(contract);
 * ```
 *
 * @param contract - an instance of a {@link SmartContract}
 * @returns an object containing the platform fee basis points and the fee recipient address
 * @twfeature PlatformFee
 * @see {@link https://portal.thirdweb.com/react/react.useplatformfees?utm_source=sdk | Documentation}

 */
export function usePlatformFees(
  contract: RequiredParam<ValidContractInstance>,
) {
  const contractAddress = contract?.getAddress();
  return useQueryWithNetwork(
    cacheKeys.extensions.platformFees.get(contractAddress),
    () => {
      requiredParamInvariant(contract, "No contract provided");
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
 * Set the platform fee recipient and basis points
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const { contract } = useContract("{{contract_address}}");
 *   const {
 *     mutate: updatePlatformFees,
 *     isLoading,
 *     error,
 *   } = useUpdatePlatformFees(contract);
 *
 *   if (error) {
 *     console.error("failed to update platform fees", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => updatePlatformFees({ updatePayload: { fee_recipient: "{{wallet_address}}", platform_fee_basis_points: 5_00 } })}
 *     >
 *       Update Platform fees
 *     </button>
 *   );
 * };
 * ```
 * @param contract - an instance of a {@link SmartContract}
 * @returns a mutation object that can be used to update the platform fees settings
 * @twfeature PlatformFee
 * @see {@link https://portal.thirdweb.com/react/react.useupdateplatformfees?utm_source=sdk | Documentation}

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
      requiredParamInvariant(contract, "No contract provided");
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
 * Get the metadata of this contract
 *
 * @example
 * ```jsx
 * const { data: metadata, isLoading, error } = useMetadata(contract);
 * ```
 *
 * @param contract - an instance of a {@link SmartContract}
 * @returns a {@link CustomContractMetadata} object containing the metadata
 * @see {@link https://portal.thirdweb.com/react/react.usemetadata?utm_source=sdk | Documentation}

 */
export function useMetadata(
  contract: RequiredParam<ValidContractInstance>,
  // TODO figure out UseQueryResult type better
): UseQueryResult {
  const contractAddress = contract?.getAddress();
  return useQueryWithNetwork(
    cacheKeys.extensions.metadata.get(contractAddress),
    () => {
      requiredParamInvariant(contract, "No contract provided");
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
 * Set the metadata of this contract
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const { contract } = useContract("{{contract_address}}");
 *   const {
 *     mutate: updateMetadata,
 *     isLoading,
 *     error,
 *   } = useUpdateMetadata(contract);
 *
 *   if (error) {
 *     console.error("failed to update metadata", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => updateMetadata({
 *        name: "My Contract",
 *        description: "This is my contract"
 *       })}
 *     >
 *       Update Contract Metadata
 *     </button>
 *   );
 * };
 * ```
 * @param contract - an instance of a {@link SmartContract}
 * @returns a mutation object that can be used to update the metadata
 * @see {@link https://portal.thirdweb.com/react/react.useupdatemetadata?utm_source=sdk | Documentation}

 */
export function useUpdateMetadata(
  contract: RequiredParam<ValidContractInstance>,
  // TODO figure out UseMutationResult type better
): UseMutationResult<any, any, any> {
  const queryClient = useQueryClient();
  const contractAddress = contract?.getAddress();
  const activeChainId = useSDKChainId();
  return useMutation(
    (updatePayload: CustomContractMetadata) => {
      requiredParamInvariant(contract, "No contract provided");
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

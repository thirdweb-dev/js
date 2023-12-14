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
 * @platformFees
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
 * @platformFees
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
 * @platformFees
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
 * @platformFees
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
 * @platformFees
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
 * @platformFees
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
 * Hook for getting the metadata associated with a smart contract.
 *
 * Available to use on contracts that implement the [Contract Metadata](/solidity/extensions/contractmetadata) interface.
 *
 * @example
 *
 *
 * ```jsx
 * import { useContract, useMetadata } from "@thirdweb-dev/react";
 *
 * const contractAddress = "{{contract_address}}";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress);
 *   const { data, isLoading, error } = useMetadata(contract);
 * }
 * ```
 *
 * @param contract - an instance of a `SmartContract`
 * @returns a `CustomContractMetadata` object containing the metadata
 *
 * The hook's `data` property, once loaded, is an object containing the contract's metadata.
 *
 * ```ts
 * CustomContractMetadata | undefined;
 * ```
 *
 * ```ts
 * interface CustomContractMetadata {
 *   // The name of the contract.
 *   name: string;
 *   // A description of the contract.
 *   description?: string;
 *   // The image associated with the contract.
 *   image?: any;
 *   // An external link associated with the contract.
 *   external_link?: string;
 * }
 * ```
 *
 * @metadata
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
 * Hook for updating the metadata of a smart contract.
 *
 * Available to use on smart contracts that implement the [ContractMetadata](/solidity/extensions/contractmetadata) interface.
 *
 * The wallet initiating this transaction must have the required permissions to update the metadata, (`admin` permissions required by default).
 *
 * Provide your contract instance from the [`useContract`](/react/react.usecontract) hook as the first argument, and
 * an object fitting the [contract-level metadata standards](https://docs.opensea.io/docs/contract-level-metadata) of
 * the new metadata as the second argument, including:
 *
 * - `name`: A `string` for the name of the smart contract (required).
 * - `description`: A `string` to describe the smart contract (optional).
 * - `image`: A `string` or `File` object containing the URL or file data of an image to associate with the contract (optional).
 * - `external_link`: A `string` containing a URL to view the smart contract on your website (optional).
 *
 * @example
 *
 * ```jsx
 * import {
 *   useUpdateMetadata,
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
 *     mutateAsync: updateMetadata,
 *     isLoading,
 *     error,
 *   } = useUpdateMetadata(contract);
 *
 *   return (
 *     <Web3Button
 *       contractAddress={contractAddress}
 *       action={() =>
 *         updateMetadata({
 *           name: "My App",
 *           description: "My awesome Ethereum App",
 *           image: "/path/to/image.jpg", // URL, URI, or File object
 *           external_link: "https://myapp.com",
 *         })
 *       }
 *     >
 *       Update Metadata
 *     </Web3Button>
 *   );
 * }
 * ```
 *
 * @param contract - an instance of a `SmartContract`
 * @returns a mutation object that can be used to update the metadata
 * @metadata
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

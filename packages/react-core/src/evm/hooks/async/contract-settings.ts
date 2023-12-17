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
 * Hook for getting the primary sales recipient of a smart contract.
 *
 * Available to use on contracts that implement the "Primary Sale" interface.
 *
 * @example
 *
 * ```jsx
 * import { useContract, usePrimarySaleRecipient } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress);
 *   const { data, isLoading, error } = usePrimarySaleRecipient(contract);
 * }
 * ```
 *
 * @param contract - Instance of a `SmartContract`
 *
 * @returns The hook's `data` property, once loaded, is a string with the wallet address of the primary sales recipient.
 *
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
 * Hook for updating the primary sale recipient on a smart contract.
 *
 * Available to use on smart contracts that implement the `PrimarySale` interface.
 *
 * The wallet that initiates this transaction must have the required permissions to change the primary sale recipient (defaults to `admin` level).
 *
 * @example
 *
 * ```jsx
 * import {
 *   useUpdatePrimarySaleRecipient,
 *   useContract,
 *   Web3Button,
 * } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress);
 *   const {
 *     mutateAsync: updatePrimarySaleRecipient,
 *     isLoading,
 *     error,
 *   } = useUpdatePrimarySaleRecipient(contract);
 *
 *   return (
 *     <Web3Button
 *       contractAddress={contractAddress}
 *       action={() => updatePrimarySaleRecipient("{{wallet_address}}")}
 *     >
 *       Update Primary Sale Recipient
 *     </Web3Button>
 *   );
 * }
 * ```
 *
 * @param contract - Instance of a `SmartContract`
 * @returns a mutation object that can be used to update the primary sales recipient
 *
 * #### walletAddress
 *
 * The wallet address to set as the primary sale recipient.
 *
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
 * Hook for retrieving royalty settings of a smart contract.
 *
 * Available to use on contracts that implement the `Royalty` interface.
 *
 * @example
 *
 * ```jsx
 * import { useContract, useRoyaltySettings } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress);
 *   const { data, isLoading, error } = useRoyaltySettings(contract);
 * }
 * ```
 *
 * @param contract - Instance of a `SmartContract`
 *
 * @returns
 * The hook's `data` property, once loaded, is an object with two properties:
 *
 * ```ts
 * {
 *   seller_fee_basis_points: number;
 *   fee_recipient: string;
 * }
 * ```
 *
 * - The `seller_fee_basis_points` is the royalty amount (in basis points) that the seller
 *   will receive for each token sale on secondary markets.
 * - The `fee_recipient` is the wallet address that will receive the royalty payments.
 *
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
 * Hook for updating royalty settings on a smart contract.
 *
 * Available to use on smart contracts that implement the `Royalty` interface.
 *
 * @example
 *
 * ```jsx
 * import {
 *   useUpdateRoyaltySettings,
 *   useContract,
 *   Web3Button,
 * } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress);
 *   const {
 *     mutateAsync: updateRoyaltySettings,
 *     isLoading,
 *     error,
 *   } = useUpdateRoyaltySettings(contract);
 *
 *   return (
 *     <Web3Button
 *       contractAddress={contractAddress}
 *       action={() =>
 *         updateRoyaltySettings({
 *           seller_fee_basis_points: 0,
 *           fee_recipient: "{{wallet_address}}",
 *         })
 *       }
 *     >
 *       Update Royalty Settings
 *     </Web3Button>
 *   );
 * }
 * ```
 *
 * @param contract - Instance of a `SmartContract`
 *
 * @returns a mutation object that can be used to update the royalty settings
 *
 * #### seller_fee_basis_points (required)
 *
 * The `seller_fee_basis_points` property is a `number` between `0` - `10000` that defines the fee rate.
 *
 * This number is in percentage points. i.e. `100` is a 1% fee and `10000` is a 100% fee.
 *
 *
 * #### fee_recipient (required)
 *
 * The `fee_recipient` property is the address of the wallet that will receive the fees.
 *
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
 * Hook for getting the platform fee settings of a contract.
 *
 * Available to use on contracts that implement the `PlatformFee` interface.
 *
 * @example
 *
 * ```jsx
 * import { useContract, usePlatformFees } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress);
 *   const { data, isLoading, error } = usePlatformFees(contract);
 * }
 * ```
 *
 * @param contract - Instance of a `SmartContract`
 *
 * @returns
 * The hook's `data` property, once loaded, is an object containing two fields:
 *
 * - `platform_fee_basis_points`: the platform fee basis points set on the contract
 * - `platform_fee_recipient`: the wallet address of the platform fee recipient
 *
 * _Note_: The basis points are in percentage format, meaning that a value of `500` is equivalent to a `5%` fee.
 *
 * ```ts
 * {
 *   platform_fee_basis_points: number;
 *   platform_fee_recipient: string;
 * }
 * ```
 *
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
 * Hook for updating platform fees on a smart contract.
 *
 * Available to use on smart contracts that implement the `PlatformFee` interface.
 *
 * ```jsx
 * import {
 *   useUpdatePlatformFees,
 *   useContract,
 *   Web3Button,
 * } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress);
 *   const {
 *     mutateAsync: updatePlatformFees,
 *     isLoading,
 *     error,
 *   } = useUpdatePlatformFees(contract);
 *
 *   return (
 *     <Web3Button
 *       contractAddress={contractAddress}
 *       action={() =>
 *         updatePlatformFees({
 *           platform_fee_basis_points: 0,
 *           fee_recipient: "{{wallet_address}}",
 *         })
 *       }
 *     >
 *       Update Platform Fees
 *     </Web3Button>
 *   );
 * }
 * ```
 *
 * @param contract - Instance of a `SmartContract`
 *
 * @returns a mutation object that can be used to update the platform fees settings
 * #### platform_fee_basis_points (required)
 *
 * The `platform_fee_basis_points` property is a `number` between `0` - `10000` that defines the fee rate.
 *
 * This number is in percentage points. i.e. `100` is a 1% fee and `10000` is a 100% fee.
 *
 * #### fee_recipient (required)
 *
 * The `fee_recipient` property is the address of the wallet that will receive the fees.
 *
 * Use the `useAddress` hook to get the current wallet address.
 *
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
 * Available to use on contracts that implement the [Contract Metadata](https://portal.thirdweb.com/solidity/extensions/contractmetadata) interface.
 *
 * @example
 * ```jsx
 * import { useContract, useMetadata } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress);
 *   const { data, isLoading, error } = useMetadata(contract);
 * }
 * ```
 *
 * @param contract - Instance of a `SmartContract`
 * @returns
 * A `CustomContractMetadata` object containing the metadata
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
 * Available to use on smart contracts that implement the `ContractMetadata` interface.
 *
 * The wallet initiating this transaction must have the required permissions to update the metadata, (`admin` permissions required by default).
 *
 * Provide your contract instance from the `useContract` hook as the first argument, and
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
 * @param contract - Instance of a `SmartContract`
 * @returns Mutation object that to update the metadata
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

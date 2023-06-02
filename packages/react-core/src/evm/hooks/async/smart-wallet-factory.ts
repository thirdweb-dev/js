import {
  RequiredParam,
  requiredParamInvariant,
} from "../../../core/query-utils/required-param";
import { useSDKChainId } from "../../providers/thirdweb-sdk-provider";
import {
  ClaimNFTParams,
  ClaimNFTReturnType,
  DelayedRevealLazyMintInput,
  DropContract,
  RevealLazyMintInput,
  getErcs,
  RevealableContract,
} from "../../types";
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
  NFT,
  NFTMetadataInput,
  QueryAllParams,
  UploadProgressEvent,
} from "@thirdweb-dev/sdk";
import { NFTDrop } from "@thirdweb-dev/sdk/dist/declarations/src/evm/contracts/prebuilt-implementations/nft-drop";
import { SignatureDrop } from "@thirdweb-dev/sdk/dist/declarations/src/evm/contracts/prebuilt-implementations/signature-drop";
import { SmartContract } from "@thirdweb-dev/sdk/dist/declarations/src/evm/contracts/smart-contract";
import type { BytesLike, providers } from "ethers";
import invariant from "tiny-invariant";

/** **********************/
/**       READ HOOKS    **/
/** **********************/

/**
 * Get all wallets
 *
 * @example
 * ```javascript
 * const { data: smartWallets, isLoading, error } = useSmartWallets(contract);
 * ```
 *
 * @param contract - an instance of a smart wallet factory contract
 * @returns a response object that includes an array of all smart wallets with their associated admin
 * @twfeature SmartWalletFactory
 * @see {@link https://portal.thirdweb.com/react/react.usesmartwallet?utm_source=sdk | Documentation}
 * @beta
 */
export function useSmartWallets(
  contract: RequiredParam<SmartContract>
): UseQueryResult<NFT[]> {
  const contractAddress = contract?.getAddress();
  return useQueryWithNetwork(
    cacheKeys.contract.smartWalletFactory.getAll(contractAddress),
    () => {
      requiredParamInvariant(contract, "No Contract instance provided");
      invariant(
        contract.smartWalletFactory.getAll,
        "Contract instance does not support getAllUnclaimed",
      );
      return contract.smartWalletFactory.getAllWallets();
    },
    { enabled: !!contract },
  );
}

/** **********************/
/**     WRITE HOOKS     **/
/** **********************/
/**
 * Create a smart wallet
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const { contract } = useContract("{{contract_address}}");
 *   const {
 *     mutate: createSmartWallet,
 *     isLoading,
 *     error,
 *   } = useCreateSmartWallet(contract);
 *
 *   if (error) {
 *     console.error("failed to create smart wallet", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => createSmartWallet("0x...")}
 *     >
 *       Create Smart Wallet
 *     </button>
 *   );
 * };
 * ```
 *
 * @param contract - an instance of a smart wallet factory contract
 * @returns a mutation object that can be used to create a smart wallet
 * @twfeature SmartWalletFactory
 * @see {@link https://portal.thirdweb.com/react/react.usecreatesmartwallet?utm_source=sdk | Documentation}
 * @beta
 */
export function useCreateSmartWallet<TContract extends DropContract>(
  contract: RequiredParam<TContract>,
) {
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();

  return useMutation(
    async (data: { admin: string; extraData: BytesLike; }) => {
      requiredParamInvariant(contract, "contract is undefined");

      return contract.smartWalletFactory.createWallet(
        data.admin,
        data.extraData,
      );


    },
    {
      onSettled: () =>
        invalidateContractAndBalances(
          queryClient,
          contractAddress,
        ),
    },
  );
}

/**
 * Lazy mint NFTs
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const { contract } = useContract("{{contract_address}}");
 *   const {
 *     mutate: lazyMint,
 *     isLoading,
 *     error,
 *   } = useLazyMint(contract);
 *
 *   if (error) {
 *     console.error("failed to lazy mint NFT", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => lazyMint({ metadatas: [{ name: "My NFT!"}] })}
 *     >
 *       Lazy mint NFT!
 *     </button>
 *   );
 * };
 * ```
 *
 * @param contract - an instance of a {@link NFTContract} with the drop extension
 * @param onProgress - an optional callback that will be called with the progress of the upload
 * @returns a mutation object that can be used to lazy mint a batch of NFTs
 * @twfeature ERC721LazyMintable | ERC1155LazyMintable
 * @see {@link https://portal.thirdweb.com/react/react.uselazymint?utm_source=sdk | Documentation}
 * @beta
 */
export function useLazyMint<TContract extends DropContract>(
  contract: RequiredParam<TContract>,
  onProgress?: (progress: UploadProgressEvent) => void,
): UseMutationResult<any, unknown, any, unknown> {
  const activeChainId = useSDKChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();
  const { erc721, erc1155 } = getErcs(contract);

  return useMutation(
    async (data: { metadatas: NFTMetadataInput[]; }) => {
      requiredParamInvariant(contract, "contract is undefined");
      let options;
      if (onProgress) {
        options = {
          onProgress,
        };
      }

      if (erc721) {
        return erc721.lazyMint(data.metadatas, options);
      }
      if (erc1155) {
        return erc1155.lazyMint(data.metadatas, options);
      }
      invariant(false, "contract is not an Erc721 or Erc1155");
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
 * Lazy mint NFTs with delayed reveal
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const { contract } = useContract("{{contract_address}}");
 *   const {
 *     mutate: delayedRevealLazyMint,
 *     isLoading,
 *     error,
 *   } = useDelayedRevealLazyMint(contract);
 *
 *   if (error) {
 *     console.error("failed to lazy mint NFT", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => delayedRevealLazyMint({ metadatas: [{ name: "My NFT!"}] })}
 *     >
 *       Delayed Reveal Lazy mint NFT!
 *     </button>
 *   );
 * };
 * ```
 *
 * @param contract - an instance of a {@link DropContract}
 * @param onProgress - an optional callback that will be called with the progress of the upload
 * @returns a mutation object that can be used to lazy mint a batch of NFTs
 * @twfeature ERC721Revealable | ERC1155Revealable
 * @see {@link https://portal.thirdweb.com/react/react.usedelayedreveallazymint?utm_source=sdk | Documentation}
 * @beta
 */
export function useDelayedRevealLazyMint<TContract extends RevealableContract>(
  contract: RequiredParam<TContract>,
  onProgress?: (progress: UploadProgressEvent) => void,
) {
  const activeChainId = useSDKChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();

  return useMutation(
    async (data: DelayedRevealLazyMintInput) => {
      requiredParamInvariant(contract, "contract is undefined");
      let options;
      if (onProgress) {
        options = {
          onProgress,
        };
      }
      const { erc721, erc1155 } = getErcs(contract);
      if (erc721) {
        return await erc721.revealer.createDelayedRevealBatch(
          data.placeholder,
          data.metadatas,
          data.password,
          options,
        );
      }
      if (erc1155) {
        return await erc1155.revealer.createDelayedRevealBatch(
          data.placeholder,
          data.metadatas,
          data.password,
          options,
        );
      }
      invariant(false, "contract is not an Erc721 or Erc1155");
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
 * Reveal a batch of delayed reveal NFTs
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const { contract } = useContract("{{contract_address}}");
 *   const {
 *     mutate: revealLazyMint,
 *     isLoading,
 *     error,
 *   } = useRevealLazyMint(contract);
 *
 *   if (error) {
 *     console.error("failed to reveal batch", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => revealLazyMint({ batchId: "0", password: "my-password" })}
 *     >
 *       Reveal batch!
 *     </button>
 *   );
 * };
 * ```
 *
 * @param contract - an instance of a {@link RevealableContract}
 * @returns a mutation object that can be used to reveal a batch of delayed reveal NFTs
 * @twfeature ERC721Revealable | ERC1155Revealable
 * @see {@link https://portal.thirdweb.com/react/react.usereveallazymint?utm_source=sdk | Documentation}
 * @beta
 */
export function useRevealLazyMint<TContract extends RevealableContract>(
  contract: RequiredParam<TContract>,
): UseMutationResult<
  Omit<
    {
      receipt: providers.TransactionReceipt;
      data: () => Promise<unknown>;
    },
    "data"
  >,
  unknown,
  RevealLazyMintInput,
  unknown
> {
  const activeChainId = useSDKChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();

  return useMutation(
    async (data: RevealLazyMintInput) => {
      requiredParamInvariant(contract, "contract is undefined");
      const { erc721, erc1155 } = getErcs(contract);
      if (erc721) {
        return await erc721.revealer.reveal(data.batchId, data.password);
      }
      if (erc1155) {
        return await erc1155.revealer.reveal(data.batchId, data.password);
      }
      invariant(false, "contract is not an Erc721 or Erc1155");
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

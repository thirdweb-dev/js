import {
  RequiredParam,
  requiredParamInvariant,
} from "../../../core/query-utils/required-param";
import { useSDKChainId } from "../useSDK";
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
} from "@thirdweb-dev/sdk/internal/react-core";
import type { NFTDrop } from "@thirdweb-dev/sdk/internal/react-core";
import type { SignatureDrop } from "@thirdweb-dev/sdk/internal/react-core";
import type { SmartContract } from "@thirdweb-dev/sdk/internal/react-core";
import type { providers } from "ethers";
import invariant from "tiny-invariant";

/** **********************/
/**       READ HOOKS    **/
/** **********************/

/**
 * Get all unclaimed NFTs
 *
 * @example
 * ```javascript
 * const { data: unclaimedNfts, isLoading, error } = useUnclaimedNFTs(contract, { start: 0, count: 100 });
 * ```
 *
 * @param contract - an instance of a contract that extends the ERC721 spec (NFT drop, Signature Drop, or any custom contract that extends the ERC721 spec)
 * @param queryParams - query params to pass to the query for the sake of pagination
 * @returns a response object that includes an array of NFTs that are unclaimed
 * @twfeature ERC721LazyMintable
 * @see {@link https://portal.thirdweb.com/react/react.useunclaimednfts?utm_source=sdk | Documentation}
 * @beta
 */
export function useUnclaimedNFTs(
  contract: RequiredParam<NFTDrop>,
  queryParams?: QueryAllParams,
): UseQueryResult<NFT[]> {
  const contractAddress = contract?.getAddress();
  return useQueryWithNetwork(
    cacheKeys.contract.nft.drop.getAllUnclaimed(contractAddress, queryParams),
    () => {
      requiredParamInvariant(contract, "No Contract instance provided");
      // TODO make this work for custom contracts (needs ABI change)
      invariant(
        contract.getAllUnclaimed,
        "Contract instance does not support getAllUnclaimed",
      );
      return contract.getAllUnclaimed(queryParams);
    },
    { enabled: !!contract },
  );
}

/**
 * Get all claimed NFTs
 *
 * @remarks Equivalent to using {@link useNFTs}.
 *
 * @example
 * ```javascript
 * const { data: claimedNFTs, isLoading, error } = useClaimedNFTs(contract, { start: 0, count: 100 });
 * ```
 *
 * @param contract - an instance of a contract that extends the ERC721 spec (NFT drop, Signature Drop, or any custom contract that extends the ERC721 spec)
 * @param queryParams - query params to pass to the query for the sake of pagination
 * @returns a response object that includes an array of NFTs that are claimed
 * @twfeature ERC721LazyMintable
 * @see {@link https://portal.thirdweb.com/react/react.useclaimednfts?utm_source=sdk | Documentation}
 * @beta
 */
export function useClaimedNFTs(
  contract: RequiredParam<NFTDrop>,
  queryParams?: QueryAllParams,
) {
  const contractAddress = contract?.getAddress();
  return useQueryWithNetwork(
    cacheKeys.contract.nft.drop.getAllClaimed(contractAddress, queryParams),
    () => {
      requiredParamInvariant(contract, "No Contract instance provided");
      // TODO make this work for custom contracts (needs ABI change)
      invariant(
        contract.getAllClaimed,
        "Contract instance does not support getAllClaimed",
      );
      return contract.getAllClaimed(queryParams);
    },
    { enabled: !!contract },
  );
}

/**
 *
 * @param contract - an instance of a contract that extends the ERC721 spec (NFT drop, Signature Drop, or any custom contract that extends the ERC721 spec)
 * @returns a response object that includes the number of NFTs that are unclaimed
 * @twfeature ERC721LazyMintable
 * @see {@link https://portal.thirdweb.com/react/react.useunclaimednftsupply?utm_source=sdk | Documentation}
 */
export function useUnclaimedNFTSupply(
  contract: RequiredParam<NFTDrop | SignatureDrop | SmartContract | null>,
) {
  const contractAddress = contract?.getAddress();
  const { erc721 } = getErcs(contract);
  return useQueryWithNetwork(
    cacheKeys.contract.nft.drop.totalUnclaimedSupply(contractAddress),
    () => {
      requiredParamInvariant(contract, "No Contract instance provided");
      if (erc721) {
        invariant(erc721, "No ERC721 Contract instance provided");
        return erc721.totalUnclaimedSupply();
      }
      invariant(false, "Contract is not an instance of ERC721");
    },
    { enabled: !!erc721 },
  );
}

/**
 * Get the total number of claimed NFTs
 *
 * @param contract - an instance of a contract that extends the ERC721 spec (NFT drop, Signature Drop, or any custom contract that extends the ERC721 spec)
 * @returns a response object that includes the number of NFTs that are claimed
 * @twfeature ERC721LazyMintable
 * @see {@link https://portal.thirdweb.com/react/react.useclaimednftsupply?utm_source=sdk | Documentation}
 */
export function useClaimedNFTSupply(
  contract: RequiredParam<NFTDrop | SignatureDrop | SmartContract | null>,
) {
  const contractAddress = contract?.getAddress();
  const { erc721 } = getErcs(contract);
  return useQueryWithNetwork(
    cacheKeys.contract.nft.drop.totalClaimedSupply(contractAddress),
    () => {
      requiredParamInvariant(contract, "No Contract instance provided");
      if (erc721) {
        return erc721.totalClaimedSupply();
      }
      invariant(false, "Contract is not an instance of ERC721");
    },
    { enabled: !!erc721 },
  );
}

/**
 * Get all unrevealed batches
 *
 * @param contract - an instance of a {@link RevealableContract}
 * @returns a response object that gets the batches to still be revealed
 * @twfeature ERC721Revealable | ERC1155Revealable
 * @see {@link https://portal.thirdweb.com/react/react.usebatchestoreveal?utm_source=sdk | Documentation}
 */
export function useBatchesToReveal<TContract extends RevealableContract>(
  contract: RequiredParam<TContract>,
) {
  const contractAddress = contract?.getAddress();
  const { erc721, erc1155 } = getErcs(contract);
  return useQueryWithNetwork(
    cacheKeys.contract.nft.drop.revealer.getBatchesToReveal(contractAddress),
    () => {
      if (erc721) {
        return erc721.revealer.getBatchesToReveal();
      }
      if (erc1155) {
        return erc1155.revealer.getBatchesToReveal();
      }
      invariant(false, "Contract instance does not support getBatchesToReveal");
    },
    { enabled: !!erc721 || !!erc1155 },
  );
}

/** **********************/
/**     WRITE HOOKS     **/
/** **********************/
/**
 * Claim an NFT to a specific wallet
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const { contract } = useContract("{{contract_address}}");
 *   const {
 *     mutate: claimNFT,
 *     isLoading,
 *     error,
 *   } = useClaimNFT(contract);
 *
 *   if (error) {
 *     console.error("failed to claim nft", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => claimNFT({ to: "{{wallet_address}}", quantity: 1 })}
 *     >
 *       Claim NFT!
 *     </button>
 *   );
 * };
 * ```
 *
 * @param contract - an instance of a {@link DropContract}
 * @returns a mutation object that can be used to claim a NFT to the wallet specificed in the params
 * @twfeature ERC721Claimable | ERC1155Claimable | ERC721ClaimPhasesV2 | ERC721ClaimPhasesV1 | ERC721ClaimConditionsV2 | ERC721ClaimConditionsV1 | ERC1155ClaimPhasesV2 | ERC1155ClaimPhasesV1 | ERC1155ClaimConditionsV2 | ERC1155ClaimConditionsV1
 * @see {@link https://portal.thirdweb.com/react/react.useclaimnft?utm_source=sdk | Documentation}
 * @beta
 */
export function useClaimNFT<TContract extends DropContract>(
  contract: RequiredParam<TContract>,
) {
  const activeChainId = useSDKChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();

  const { erc721, erc1155 } = getErcs(contract);

  return useMutation(
    async (data: ClaimNFTParams) => {
      requiredParamInvariant(contract, "contract is undefined");

      if (erc1155) {
        requiredParamInvariant(data.tokenId, "tokenId not provided");
        if (!data.to) {
          return (await erc1155.claim(
            data.tokenId,
            data.quantity,
            data.options,
          )) as ClaimNFTReturnType;
        }
        return (await erc1155.claimTo(
          data.to,
          data.tokenId,
          data.quantity,
          data.options,
        )) as ClaimNFTReturnType;
      }
      if (erc721) {
        if (!data.to) {
          return (await erc721.claim(
            data.quantity,
            data.options,
          )) as ClaimNFTReturnType;
        }
        return (await erc721.claimTo(
          data.to,
          data.quantity,
          data.options,
        )) as ClaimNFTReturnType;
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
    async (data: { metadatas: NFTMetadataInput[] }) => {
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

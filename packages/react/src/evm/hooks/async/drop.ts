import {
  RequiredParam,
  requiredParamInvariant,
} from "../../../core/query-utils/required-param";
import { useSDKChainId } from "../../providers/base";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  NFTMetadataInput,
  QueryAllParams,
  UploadProgressEvent,
} from "@thirdweb-dev/sdk";
import { NFTDrop } from "@thirdweb-dev/sdk/dist/declarations/src/evm/contracts/prebuilt-implementations/nft-drop";
import invariant from "tiny-invariant";

/** **********************/
/**       READ HOOKS    **/
/** **********************/

/**
 * Use this to get a list of *unclaimed* NFT tokens of your ERC721 Drop contract.
 *
 * @example
 * ```javascript
 * const { data: unclaimedNfts, isLoading, error } = useUnclaimedNFTs(<YourERC721DropContractInstance>, { start: 0, count: 100 });
 * ```
 *
 * @param contract - an instance of a contract that extends the Erc721 spec (nft drop, custom contract that follows the Erc721 & drop spec)
 * @param queryParams - query params to pass to the query for the sake of pagination
 * @returns a response object that includes an array of NFTs that are unclaimed
 * @twfeature ERC721LazyMintable | ERC1155LazyMintable
 * @beta
 */
export function useUnclaimedNFTs(
  contract: RequiredParam<NFTDrop>,
  queryParams?: QueryAllParams,
) {
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
 * Use this to get a list of *claimed* (minted) NFT tokens of your ERC721 Drop contract.
 *
 * @remarks Equivalent to using {@link useNFTs}.
 *
 * @example
 * ```javascript
 * const { data: claimedNFTs, isLoading, error } = useClaimedNFTs(<YourERC721DropContractInstance>, { start: 0, count: 100 });
 * ```
 *
 * @param contract - an instance of a {@link DropContract}
 * @param queryParams - query params to pass to the query for the sake of pagination
 * @returns a response object that includes an array of NFTs that are claimed
 * @twfeature ERC721LazyMintable | ERC1155LazyMintable
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
 * @param contract - an instance of a {@link NFTDrop}
 * @returns a response object that includes the number of NFTs that are unclaimed
 * @twfeature ERC721LazyMintable | ERC1155LazyMintable
 */
export function useUnclaimedNFTSupply(contract: RequiredParam<DropContract>) {
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

 *
 * @param contract - an instance of a {@link DropContract}
 * @returns a response object that includes the number of NFTs that are claimed
 * @twfeature ERC721LazyMintable | ERC1155LazyMintable
 */
export function useClaimedNFTSupply(contract: RequiredParam<DropContract>) {
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
 *
 * @param contract - an instance of a {@link RevealableContract}
 * @returns a response object that gets the batches to still be revealed
 * @twfeature ERC721Revealable | ERC1155Revealable
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
 * Use this to claim a NFT on your {@link DropContract}
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const { contract } = useContract(<ContractAddress>);
 *   const {
 *     mutate: claimNft,
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
 *       onClick={() => claimNft({ to: "0x...", quantity: 1 })}
 *     >
 *       Claim NFT!
 *     </button>
 *   );
 * };
 * ```
 *
 * @param contract - an instance of a {@link DropContract}
 * @returns a mutation object that can be used to claim a NFT to the wallet specificed in the params
 * @twfeature ERC721Claimable | ERC1155Claimable
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
 * Use this to lazy mint a batch of NFTs on your {@link DropContract}
 *
 * @param contract - an instance of a {@link NFTContract} with the drop extension
 * @param onProgress - an optional callback that will be called with the progress of the upload
 * @returns a mutation object that can be used to lazy mint a batch of NFTs
 * @twfeature ERC721LazyMintable | ERC1155LazyMintable
 * @beta
 */
export function useLazyMint<TContract extends DropContract>(
  contract: RequiredParam<TContract>,
  onProgress?: (progress: UploadProgressEvent) => void,
) {
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
 * Use this to lazy mint a batch of delayed reveal NFTs on your {@link DropContract}
 *
 * @param contract - an instance of a {@link DropContract}
 * @param onProgress - an optional callback that will be called with the progress of the upload
 * @returns a mutation object that can be used to lazy mint a batch of NFTs
 * @twfeature ERC721Revealable | ERC1155Revealable
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
 * Use this to reveal a batch of delayed reveal NFTs on your {@link RevealableContract}
 *
 * @param contract - an instance of a {@link RevealableContract}
 * @returns a mutation object that can be used to reveal a batch of delayed reveal NFTs
 * @twfeature ERC721Revealable | ERC1155Revealable
 * @beta
 */
export function useRevealLazyMint<TContract extends RevealableContract>(
  contract: RequiredParam<TContract>,
) {
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

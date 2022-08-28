import { useActiveChainId } from "../../Provider";
import {
  ClaimNFTParams,
  ClaimNFTReturnType,
  DelayedRevealLazyMintInput,
  DropContract,
  NFTContract,
  RequiredParam,
  RevealLazyMintInput,
} from "../../types";
import {
  cacheKeys,
  invalidateContractAndBalances,
} from "../../utils/cache-keys";
import { useQueryWithNetwork } from "../query-utils/useQueryWithNetwork";
import { useNFTs } from "./nft";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  NFTDrop,
  NFTMetadataInput,
  QueryAllParams,
  SignatureDrop,
  UploadProgressEvent,
} from "@thirdweb-dev/sdk";
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
      invariant(contract, "No Contract instance provided");
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
 * @beta
 */
export function useClaimedNFTs(
  contract: RequiredParam<DropContract>,
  queryParams?: QueryAllParams,
) {
  return useNFTs(contract, queryParams);
}
/**
 *
 * @param contract - an instance of a {@link NFTDrop}
 * @returns a response object that includes the number of NFTs that are unclaimed
 */
export function useUnclaimedNFTSupply(
  contract: RequiredParam<NFTDrop | SignatureDrop>,
) {
  const contractAddress = contract?.getAddress();
  return useQueryWithNetwork(
    cacheKeys.contract.nft.drop.totalUnclaimedSupply(contractAddress),
    () => {
      invariant(contract, "No Contract instance provided");

      invariant(
        contract.totalUnclaimedSupply,
        "Contract instance does not support totalUnclaimedSupply",
      );
      return contract.totalUnclaimedSupply();
    },
    { enabled: !!contract },
  );
}

/**
 *
 * @param contract - an instance of a {@link DropContract}
 * @returns a response object that includes the number of NFTs that are claimed
 */
export function useClaimedNFTSupply(contract: RequiredParam<DropContract>) {
  const contractAddress = contract?.getAddress();
  return useQueryWithNetwork(
    cacheKeys.contract.nft.drop.totalClaimedSupply(contractAddress),
    () => {
      invariant(contract, "No Contract instance provided");
      if (contract.featureName === "ERC1155") {
        return contract.getTotalCount();
      }
      invariant(
        contract.totalClaimedSupply,
        "Contract instance does not support totalClaimedSupply",
      );
      return contract.totalClaimedSupply();
    },
    { enabled: !!contract },
  );
}

/**
 *
 * @param contract - an instance of a {@link NFTContract}
 * @returns a response object that gets the batches to still be revealed
 */
export function useBatchesToReveal<TContract extends NFTContract>(
  contract: RequiredParam<TContract>,
) {
  const contractAddress = contract?.getAddress();
  return useQueryWithNetwork(
    cacheKeys.contract.nft.drop.revealer.getBatchesToReveal(contractAddress),
    () => {
      invariant(contract, "No Contract instance provided");
      invariant(
        contract.drop?.revealer?.getBatchesToReveal,
        "Contract instance does not support drop.revealer.getBatchesToReveal",
      );
      return contract.drop.revealer.getBatchesToReveal();
    },
    { enabled: !!contract },
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
 *   const {
 *     mutate: claimNft,
 *     isLoading,
 *     error,
 *   } = useClaimNFT(DropContract);
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
 * @beta
 */
export function useClaimNFT<TContract extends DropContract>(
  contract: RequiredParam<TContract>,
) {
  const activeChainId = useActiveChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();

  return useMutation(
    async (data: ClaimNFTParams<TContract>) => {
      invariant(data.to, 'No "to" address provided');
      invariant(contract?.claimTo, "contract does not support claimTo");
      if (contract.featureName === "ERC1155") {
        invariant("tokenId" in data, "tokenId not provided");
        const { to, tokenId, quantity } = data;
        return (await contract.claimTo(
          to,
          tokenId,
          quantity,
          data.checkERC20Allowance,
        )) as ClaimNFTReturnType<TContract>;
      }
      return (await contract.claimTo(
        data.to,
        data.quantity,
        data.checkERC20Allowance,
      )) as ClaimNFTReturnType<TContract>;
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
 * @beta
 */
export function useLazyMint<TContract extends NFTContract>(
  contract: RequiredParam<TContract>,
  onProgress?: (progress: UploadProgressEvent) => void,
) {
  const activeChainId = useActiveChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();

  return useMutation(
    async (data: { metadatas: NFTMetadataInput[] }) => {
      invariant(
        contract?.drop?.lazyMint,
        "contract does not support drop.lazyMint",
      );
      let options;
      if (onProgress) {
        options = {
          onProgress,
        };
      }
      return await contract.drop.lazyMint(data.metadatas, options);
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
 * @param contract - an instance of a {@link NFTContract} with the drop extension
 * @param onProgress - an optional callback that will be called with the progress of the upload
 * @returns a mutation object that can be used to lazy mint a batch of NFTs
 * @beta
 */
export function useDelayedRevealLazyMint<TContract extends NFTContract>(
  contract: RequiredParam<TContract>,
  onProgress?: (progress: UploadProgressEvent) => void,
) {
  const activeChainId = useActiveChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();

  return useMutation(
    async (data: DelayedRevealLazyMintInput) => {
      invariant(
        contract?.drop?.revealer?.createDelayedRevealBatch,
        "contract does not support drop.revealer.createDelayedRevealBatch",
      );
      let options;
      if (onProgress) {
        options = {
          onProgress,
        };
      }
      return await contract.drop.revealer.createDelayedRevealBatch(
        data.placeholder,
        data.metadatas,
        data.password,
        options,
      );
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
 * Use this to reveal a batch of delayed reveal NFTs on your {@link DropContract}
 *
 * @param contract - an instance of a {@link NFTContract} with the drop extension
 * @returns a mutation object that can be used to reveal a batch of delayed reveal NFTs
 * @beta
 */
export function useRevealLazyMint<TContract extends NFTContract>(
  contract: RequiredParam<TContract>,
) {
  const activeChainId = useActiveChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();

  return useMutation(
    async (data: RevealLazyMintInput) => {
      invariant(
        contract?.drop?.revealer?.reveal,
        "contract does not support drop.revealer.reveal",
      );
      return await contract.drop.revealer.reveal(data.batchId, data.password);
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

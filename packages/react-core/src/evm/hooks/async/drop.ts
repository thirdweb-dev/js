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
} from "@thirdweb-dev/sdk";
import type { NFTDrop } from "@thirdweb-dev/sdk";
import type { SignatureDrop } from "@thirdweb-dev/sdk";
import type { SmartContract } from "@thirdweb-dev/sdk";
import type { providers } from "ethers";
import invariant from "tiny-invariant";

/** **********************/
/**       READ HOOKS    **/
/** **********************/

/**
 * Hook for fetching information about all NFTs that haven't been claimed yet from an NFT Drop contract.
 *
 * Available to use on contracts that extends the ERC721 spec
 *
 * @example
 *
 * ```jsx
 * import { useUnclaimedNFTs, useContract } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress);
 *   const { data, isLoading, error } = useUnclaimedNFTs(contract);
 * }
 * ```
 *
 * @param contract - Instance of a contract that extends the ERC721 spec (NFT drop, Signature Drop, or any custom contract that extends the ERC721 spec)
 *
 * @param queryParams -
 * query params to pass to the query for the sake of pagination
 * By default, the hook returns the first 100 unclaimed NFTs from the contract.
 *
 * Paginate the results by providing a `queryParams` object as the second argument.
 *
 * ```jsx
 * import { useUnclaimedNFTs, useContract } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress);
 *   const { data, isLoading, error } = useUnclaimedNFTs(
 *     contract,
 *     {
 *       count: 10, // Limit the number of results
 *       start: 0, // Start from the nth result (useful for pagination)
 *     },
 *   );
 * }
 * ```
 *
 * @returns
 * The hook's `data` property, once loaded, contains an array of `NFT` objects.
 *
 * @twfeature ERC721LazyMintable
 * @nftDrop
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
 * Hook for fetching all claimed NFTs from a given NFT Drop contract.
 *
 * Available to use on contracts that implement [`ERC721Claimable`](https://portal.thirdweb.com/contracts/build/extensions/erc-721/ERC721Claimable),
 * such as the [NFT Drop](https://thirdweb.com/thirdweb.eth/DropERC721).
 *
 * @example
 *
 * ```jsx
 * import { useClaimedNFTs, useContract } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress, "nft-drop");
 *   const { data: nfts, isLoading, error } = useClaimedNFTs(contract);
 * }
 * ```
 *
 * @param contract - Instance of a contract that extends the ERC721 spec (NFT drop, Signature Drop, or any custom contract that extends the ERC721 spec)
 *
 * @param queryParams -
 * By default, the hook will return the first `100` claimed NFTs
 *
 * You can use the `queryParams` argument to paginate the NFTs that are returned.
 *
 * ```jsx
 * import { useClaimedNFTs, useContract } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress, "nft-drop");
 *   const { data, isLoading, error } = useClaimedNFTs(
 *     contract,
 *     {
 *       // For example, to only return the first 50 claimed NFTs in the collection
 *       // in order of token ID
 *       count: 50,
 *       start: 0,
 *     },
 *   );
 * }
 * ```
 *
 * @returns Query Result object that includes an array of NFTs that are claimed in the `data` property
 * @twfeature ERC721LazyMintable
 * @nftDrop
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
 * Hook for fetching the number of unclaimed NFTs from an NFT/Edition Drop contract.
 *
 * Unclaimed NFTs are tokens that were lazy-minted but have not yet been claimed by a user.
 *
 * Available to use on contracts that implement the [`LazyMint`](https://portal.thirdweb.com/contracts/build/extensions/general/LazyMint) extension;
 * such as the [NFT Drop](https://thirdweb.com/thirdweb.eth/DropERC721) contract.
 *
 * @example
 *
 * ```jsx
 * import { useUnclaimedNFTSupply, useContract } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress, "nftDrop");
 *   const { data, isLoading, error } = useUnclaimedNFTSupply(contract);
 * }
 * ```
 *
 * @param contract - Instance of a contract that extends the ERC721 spec (NFT drop, Signature Drop, or any custom contract that extends the ERC721 spec)
 *
 * @returns
 * The hook's `data` property, once loaded, contains a `BigNumber` representing the number of unclaimed NFTs.
 *
 *
 * @twfeature ERC721LazyMintable
 *
 * @nftDrop
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
 * Hook for retrieving the total supply of NFTs claimed from an NFT Drop contract.
 *
 * Available to use on contracts that implement [`ERC721Claimable`](https://portal.thirdweb.com/contracts/build/extensions/erc-721/ERC721Claimable).
 *
 * @example
 *
 * ```jsx
 * import { useClaimedNFTSupply, useContract } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress);
 *   const { data, isLoading } = useClaimedNFTSupply(contract);
 * }
 * ```
 *
 * @param contract - Instance of a contract that extends the ERC721 spec (NFT drop, Signature Drop, or any custom contract that extends the ERC721 spec)
 *
 * @returns
 * The hook's `data` property, once loaded, is a `BigNumber` representing the total supply of NFTs claimed from the NFT drop contract so far.
 *
 * @twfeature ERC721LazyMintable
 * @nftDrop
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
 * Hook for fetching batches of lazy-minted NFTs that were set to be revealed at a later date, but have not yet been revealed.
 *
 * Available to use on contracts that implement the [ERC721Revealable](https://portal.thirdweb.com/contracts/build/extensions/erc-721/ERC721Revealable)
 * or [ERC1155Revealable](https://portal.thirdweb.com/contracts/build/extensions/erc-1155/ERC1155Revealable) interfaces,
 * such as the [NFT Drop](https://thirdweb.com/thirdweb.eth/DropERC721)
 * and [Edition Drop](https://thirdweb.com/thirdweb.eth/DropERC1155) smart contracts.
 *
 * @example
 * ```tsx
 * import { useBatchesToReveal, useContract } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress);
 *   const { data: batches, isLoading, error } = useBatchesToReveal(contract);
 * }
 * ```
 *
 * @param contract - Instance of a `RevealableContract`
 *
 * @returns The hook's `data` property, once loaded, contains an array of batches that need to be revealed.
 *
 * Each batch is an object with the following properties:
 *
 * ```ts
 * {
 *   batchId: BigNumber;
 *   batchUri: string;
 *   placeholderMetadata: NFTMetadata;
 * }
 * ```
 *
 * @twfeature ERC721Revealable | ERC1155Revealable
 * @delayedReveal
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
 * Hook for claiming an NFT from a smart contract.
 *
 * Available to use on smart contracts that implement a  `Claimable` interface, and follow either the `ERC721`or `ERC1155` standard.
 *
 * @example
 * ```jsx
 * import { useContract, useClaimNFT, Web3Button } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress);
 *   const { mutateAsync: claimNft, isLoading, error } = useClaimNFT(contract);
 *
 *   return (
 *     <Web3Button
 *       contractAddress={contractAddress}
 *       action={() =>
 *         claimNft({
 *           to: "{{wallet_address}}", // Use useAddress hook to get current wallet address
 *           quantity: 1,
 *         })
 *       }
 *     >
 *       Claim NFT
 *     </Web3Button>
 *   );
 * }
 * ```
 *
 * @param contract - Instance of a `DropContract`
 *
 * @returns A mutation object to claim a NFT to the wallet specified in the params
 *
 * ```ts
 * const { mutateAsync, isLoading, error } = useClaimNFT(contract);
 * ```
 *
 * ### options
 *
 * The mutation function takes an object as argument with below properties:
 *
 * #### to
 *
 * The wallet address to mint the NFT(s) to.
 *
 * Use the `useAddress` hook to get the currently connected wallet address.
 *
 * #### quantity
 *
 * The number of NFTs you wish to claim.
 *
 * - With ERC721 contracts, this represents the number of unique tokens you wish to claim.
 * - With ERC1155 contracts, this represents the quantity of the specific `tokenId` you wish to claim.
 *
 * #### tokenId
 *
 * For ERC1155 contracts, you must specify a specific `tokenId` to claim.
 *
 * #### options (optional)
 *
 * Customizable `ClaimOptions` object to override the default behaviour of the hook.
 *
 * There are three options available:
 *
 * - `checkERC20Allowance` - Whether to check the ERC20 allowance of the sender, defaults to true.
 * - `currencyAddress` - The currency to pay for each token claimed, defaults to `NATIVE_TOKEN_ADDRESS` for native currency.
 * - `pricePerToken` - The price to pay for each token claimed. Not relevant when using claim conditions.
 *
 * ```jsx
 * import { useContract, useClaimNFT, Web3Button } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress);
 *   const { mutate: claimNft, isLoading, error } = useClaimNFT(contract);
 *
 *   return (
 *     <Web3Button
 *       contractAddress={contractAddress}
 *       action={() =>
 *         claimNft({
 *           to: "{{wallet_address}}",
 *           quantity: 1,
 *           options: {
 *             checkERC20Allowance: true,
 *             currencyAddress: "{{erc20_address}}",
 *             pricePerToken: 0,
 *           },
 *         })
 *       }
 *     >
 *       Claim NFT
 *     </Web3Button>
 *   );
 * }
 * ```
 *
 * @twfeature ERC721Claimable | ERC1155Claimable | ERC721ClaimPhasesV2 | ERC721ClaimPhasesV1 | ERC721ClaimConditionsV2 | ERC721ClaimConditionsV1 | ERC1155ClaimPhasesV2 | ERC1155ClaimPhasesV1 | ERC1155ClaimConditionsV2 | ERC1155ClaimConditionsV1
 * @nftDrop
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
 * Hook for lazy minting a batch of NFTs on a drop contract.
 *
 * Available to use on smart contracts that implement the "Drop" extension, and
 * follow either the `ERC721` or `ERC1155` standard.
 *
 * @example
 *
 * Provide your drop contract (ERC721 or ERC1155) as the argument to the hook, and an array
 * of metadata objects to lazy-mint.
 *
 * ```jsx
 * import { useContract, useLazyMint, Web3Button } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress);
 *   const { mutateAsync: lazyMint, isLoading, error } = useLazyMint(contract);
 *
 *   return (
 *     <Web3Button
 *       contractAddress={contractAddress}
 *       action={() =>
 *         lazyMint({
 *           // Metadata of the NFTs to upload
 *           metadatas: [
 *             {
 *               name: "My NFT",
 *               description: "An example NFT",
 *               image: "{{image_url}}",
 *             },
 *           ],
 *         })
 *       }
 *     >
 *       Lazy Mint NFTs
 *     </Web3Button>
 *   );
 * }
 * ```
 *
 * @param contract - Instance of a `NFTContract` with the drop extension
 *
 * @param onProgress - Optional callback that will be called with the progress of the upload
 *
 * @returns A mutation object to lazy mint a batch of NFTs
 *
 * ```ts
 * const { mutateAsync, isLoading, error } = useLazyMint(contract);
 * ```
 *
 * ### options
 *
 * The mutation function takes an object as argument with below properties:
 *
 * #### metadatas
 * An array of objects containing the metadata of the NFTs to lazy mint.
 *
 * Your metadata objects must follow the [Metadata standards](https://docs.opensea.io/docs/metadata-standards#metadata-structure).
 *
 * ```jsx
 * import { useContract, useLazyMint, Web3Button } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress);
 *   const { mutateAsync: lazyMint, isLoading, error } = useLazyMint(contract);
 *
 *   return (
 *     <Web3Button
 *       contractAddress={contractAddress}
 *       action={() =>
 *         lazyMint({
 *           // Metadata of the NFTs to upload
 *           metadatas: [
 *             {
 *               name: "My NFT",
 *               description: "An example NFT",
 *               image: "{{image_url}}",
 *             },
 *           ],
 *         })
 *       }
 *     >
 *       Lazy Mint NFTs
 *     </Web3Button>
 *   );
 * }
 * ```
 *
 * @twfeature ERC721LazyMintable | ERC1155LazyMintable
 * @nftDrop
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
 * Hook to lazy-mint a batch of NFTs with [delayed reveal](https://portal.thirdweb.com/glossary/delayed-reveal);
 * allowing the owner to set placeholder metadata and reveal the metadata of the NFTs at a later time.
 *
 * Available to use on contracts that implement the
 * [ERC721Revealable](https://portal.thirdweb.com/contracts/build/extensions/erc-721/ERC721Revealable)
 * or [ERC1155Revealable](https://portal.thirdweb.com/contracts/build/extensions/erc-1155/ERC1155Revealable)
 * interfaces.
 *
 * @example
 * ```tsx
 * import {
 *   useDelayedRevealLazyMint,
 *   useContract,
 *   Web3Button,
 * } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress);
 *   const {
 *     mutateAsync: mintNft,
 *     isLoading,
 *     error,
 *   } = useDelayedRevealLazyMint(contract);
 *
 *   const nftData = {
 *     placeholder: {
 *       name: "My NFT",
 *       description: "This is my NFT",
 *       image: "ipfs://example.com/my-nft.png", // Accepts any URL or File type
 *     },
 *     metadatas: [
 *       {
 *         name: "My NFT",
 *         description: "This is my NFT",
 *         image: "ipfs://example.com/my-nft.png", // Accepts any URL or File type
 *       },
 *     ],
 *     password: "{{password}}", // Password to be used for encryption
 *   };
 *
 *   return (
 *     <Web3Button
 *       contractAddress={contractAddress}
 *       action={() => mintNft(nftData)}
 *     >
 *       Mint NFTs
 *     </Web3Button>
 *   );
 * }
 * ```
 *
 * @param contract - Instance of a {@link DropContract}
 * @param onProgress - an optional callback that will be called with the progress of the upload
 * @returns Mutation object to lazy mint a batch of NFTs
 *
 * ```ts
 * const { mutateAsync, isLoading, error } = useDelayedRevealLazyMint(contract);
 * ```
 *
 * ### options
 * The mutation function takes an object as argument with below properties:
 *
 * #### metadatas
 * An array of metadata objects, representing the metadata of the NFTs to be lazy-minted. Each metadata object must conform to the [standard metadata properties](https://docs.opensea.io/docs/metadata-standards).
 *
 * #### password
 * The password used to encrypt the metadatas.
 *
 * __The password CANNOT be recovered once it is set. If you lose the password, you will not be able to reveal the metadata.__
 *
 * @twfeature ERC721Revealable | ERC1155Revealable
 * @delayedReveal
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
 * Hook for revealing a batch of delayed reveal NFTs using [delayed reveal](https://portal.thirdweb.com/glossary/delayed-reveal).
 *
 * Available to use on contracts that implement the
 * [ERC721Revealable](https://portal.thirdweb.com/contracts/build/extensions/erc-721/ERC721Revealable)
 * or [ERC1155Revealable](https://portal.thirdweb.com/contracts/build/extensions/erc-1155/ERC1155Revealable)
 * interfaces.
 *
 * ```jsx
 * import { useRevealLazyMint } from "@thirdweb-dev/react";
 *
 * const { mutateAsync, isLoading, error } = useRevealLazyMint(contract);
 * ```
 *
 * @example
 * ```tsx
 * import {
 *   useContract,
 *   useRevealLazyMint,
 *   Web3Button,
 * } from "@thirdweb-dev/react";
 *
 * function App() {
 *   // Contract must be an ERC-721 or ERC-1155 contract that implements the ERC721Revealable or ERC1155Revealable interface
 *   const { contract } = useContract(contractAddress);
 *   const {
 *     mutateAsync: revealLazyMint,
 *     isLoading,
 *     error,
 *   } = useRevealLazyMint(contract);
 *
 *   return (
 *     <Web3Button
 *       contractAddress={contractAddress}
 *       action={() =>
 *         revealLazyMint({
 *           batchId: "{{batch_id}}", // ID of the batch to reveal (use useBatchesToReveal to get the batch IDs)
 *           password: "{{password}}", // Password to reveal the batch
 *         })
 *       }
 *     >
 *       Reveal Lazy Mint
 *     </Web3Button>
 *   );
 * }
 * ```
 *
 * @param contract - Instance of a `RevealableContract`
 * @twfeature ERC721Revealable | ERC1155Revealable
 * @delayedReveal
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

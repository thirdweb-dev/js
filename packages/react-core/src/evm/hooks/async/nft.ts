import type { BasicNFTInput } from "@thirdweb-dev/sdk";
import {
  requiredParamInvariant,
  RequiredParam,
} from "../../../core/query-utils/required-param";
import { useSDKChainId } from "../useSDK";
import {
  AirdropNFTParams,
  BurnNFTParams,
  MintNFTParams,
  MintNFTReturnType,
  MintNFTSupplyParams,
  TransferNFTParams,
  WalletAddress,
  NFTContract,
  getErcs,
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
import { Erc1155, QueryAllParams, NFT } from "@thirdweb-dev/sdk";
import { BigNumber, BigNumberish, providers } from "ethers";
import invariant from "tiny-invariant";

/** **********************/
/**     READ  HOOKS     **/
/** **********************/

/**
 * Hook for fetching information about an NFT from a smart contract.
 *
 * Available to use on smart contracts that implement the `ERC721`
 * or `ERC1155` standard.
 *
 * NFT metadata is automatically fetched from where the `tokenUri` is hosted (e.g. IPFS), and makes the `image`
 * property available as a URL through our IPFS gateway (if the image is hosted on IPFS).
 *
 * @example
 *
 * Provide your NFT collection contract object and the token ID of the NFT you want to fetch as
 * arguments.
 *
 * ```jsx
 * import { useContract, useNFT } from "@thirdweb-dev/react";
 *
 * // The token ID of the NFT you want to fetch
 * const tokenId = 0;
 *
 * function App() {
 *   const { contract } = useContract("{{contract_address}}");
 *   const { data: nft, isLoading, error } = useNFT(contract, tokenId);
 *
 *   if (isLoading) return <div>Fetching NFT…</div>;
 *   if (error) return <div>Error fetching NFT</div>;
 *   if (!nft) return <div>NFT not found</div>;
 *   return <div>NFT: {nft.metadata.name}</div>;
 * }
 * ```
 *
 * @param contract - an instance of a `NFTContract`
 *
 * @param tokenId - The token ID of the NFT you want to fetch.
 * ```jsx
 * import { useContract, useNFT } from "@thirdweb-dev/react";
 *
 * // The token ID of the NFT you want to fetch
 * const tokenId = 0;
 *
 * function App() {
 *   const { contract } = useContract("{{contract_address}}");
 *   const {
 *     data: nft,
 *     isLoading,
 *     error,
 *   } = useNFT(
 *     contract,
 *     tokenId,
 *   );
 * }
 * ```
 *
 * @returns a response object that includes the metadata for the given tokenId
 * @twfeature ERC721 | ERC1155
 * @nft
 */
export function useNFT<TContract extends NFTContract>(
  contract: RequiredParam<TContract>,
  tokenId: RequiredParam<BigNumberish>,
) {
  const contractAddress = contract?.getAddress();
  const { erc721, erc1155 } = getErcs(contract);

  return useQueryWithNetwork<NFT>(
    cacheKeys.contract.nft.get(contractAddress, tokenId),
    async () => {
      requiredParamInvariant(contract, "No Contract instance provided");

      if (erc1155) {
        invariant(erc1155.get, "Contract instance does not support get");
        return await erc1155.get(BigNumber.from(tokenId || 0));
      }
      if (erc721) {
        invariant(erc721.get, "Contract instance does not support get");
        return await erc721.get(BigNumber.from(tokenId || 0));
      }
      invariant(false, "Unknown NFT type");
    },
    {
      enabled: !!erc721 || (!!erc1155 && tokenId !== undefined),
    },
  );
}

/**
 * Hook to query all NFTs associated with a smart contract.
 *
 * Available to use on smart contracts that implement the `ERC721`
 * or `ERC1155` standard.
 *
 * NFT metadata is automatically fetched from where the `tokenUri` is hosted (e.g. IPFS), and makes the `image`
 * property available as a URL through our IPFS gateway (if the image is hosted on IPFS).
 *
 * By default, only returns the first `100` NFTs in the collection. You can use the [`queryParams`](#queryParams) argument to
 * filter the NFTs that are returned or to paginate through the collection.
 *
 * @example
 *
 * ```jsx
 * import { useNFTs, useContract } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress);
 *   const { data, isLoading, error } = useNFTs(contract);
 * }
 * ```
 *
 * @param contract - an instance of a `NFTContract`
 *
 * @param queryParams -
 * By default, the hook will return the first 100 NFTs associated with the contract.
 *
 * You can use the `queryParams` argument to paginate the NFTs that are returned.
 *
 * @returns a response object that includes an array of `NFT` objects
 * @twfeature ERC721Supply | ERC721Enumerable | ERC1155Enumerable
 * @nft
 */
export function useNFTs<TContract extends NFTContract>(
  contract: RequiredParam<TContract>,
  queryParams?: QueryAllParams,
) {
  const contractAddress = contract?.getAddress();
  const { erc721, erc1155 } = getErcs(contract);

  return useQueryWithNetwork<NFT[]>(
    cacheKeys.contract.nft.query.all(contractAddress, queryParams),
    async () => {
      requiredParamInvariant(contract, "No Contract instance provided");

      if (erc721) {
        invariant(erc721.getAll, "Contract instance does not support getAll");
        return await erc721.getAll(queryParams);
      }
      if (erc1155) {
        invariant(erc1155.getAll, "Contract instance does not support getAll");
        return await erc1155.getAll(queryParams);
      }
      invariant(false, "Unknown NFT type");
    },
    {
      enabled: !!erc721 || !!erc1155,
    },
  );
}

/**
 * Hook to get the total count of **unique** NFTs minted on a smart contract.
 *
 * Available to use on smart contracts that implement the `ERC721`
 * or `ERC1155` standard.
 *
 * When used for ERC1155 contracts, the total count is the number of unique token IDs minted, _not_ the total supply of all tokens in circulation.
 *
 * @example
 *
 *
 * ```jsx
 * import { useTotalCount, useContract } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress);
 *   const { data: totalCount, isLoading, error } = useTotalCount(contract);
 * }
 * ```
 *
 * @param contract - an instance of a `NFTContract`
 * @returns a `BigNumber` that includes the total count of NFTs
 * @twfeature ERC721Supply | ERC1155Enumerable
 * @nft
 */
export function useTotalCount<TContract extends NFTContract>(
  contract: RequiredParam<TContract>,
) {
  const contractAddress = contract?.getAddress();
  const { erc721, erc1155 } = getErcs(contract);

  return useQueryWithNetwork<BigNumber>(
    cacheKeys.contract.nft.query.totalCount(contractAddress),
    async () => {
      requiredParamInvariant(contract, "No Contract instance provided");

      if (erc1155) {
        invariant(
          erc1155.totalCount,
          "Contract instance does not support totalCount",
        );
        return await erc1155.totalCount();
      }
      if (erc721) {
        invariant(
          erc721.totalCount,
          "Contract instance does not support totalCount",
        );
        return await erc721.totalCount();
      }
      invariant(false, "Unknown NFT type");
    },
    {
      enabled: !!erc721 || !!erc1155,
    },
  );
}

/**
 * Hook for fetching the total number of NFTs in circulation for a given smart contract.
 *
 * This takes into account the increase in supply due to minting and the decrease in supply due to burning.
 *
 * Available to use on contracts that implement either the [ERC721](https://portal.thirdweb.com/solidity/extensions/erc721)
 * or [ERC1155](https://portal.thirdweb.com/solidity/extensions/erc1155) standard.
 *
 * @example
 *
 * ```jsx
 * import { useTotalCirculatingSupply, useContract } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress);
 *   const { data, isLoading, error } = useTotalCirculatingSupply(contract);
 * }
 * ```
 *
 * @param contract - an instance of a `NFTContract`
 *
 * @param tokenId - required for ERC1155, the tokenId to look up. This will return the total quantity of the given token ID in circulation.
 * ```ts
 * import { useTotalCirculatingSupply, useContract } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress);
 *   const { data, isLoading, error } = useTotalCirculatingSupply(
 *     contract,
 *     "{{token_id}}",
 *   );
 * }
 * ```
 *
 * @returns a `BigNumber` representing the total circulating supply.
 *
 * @twfeature ERC721Supply | ERC1155Enumerable
 * @nft
 */
export function useTotalCirculatingSupply(
  contract: RequiredParam<NFTContract>,
  tokenId?: RequiredParam<BigNumberish>,
) {
  const contractAddress = contract?.getAddress();
  const { erc721, erc1155 } = getErcs(contract);

  return useQueryWithNetwork<BigNumber>(
    cacheKeys.contract.nft.query.totalCirculatingSupply(
      contractAddress,
      tokenId ?? undefined,
    ),
    async () => {
      requiredParamInvariant(contract, "No Contract instance provided");

      if (erc1155) {
        invariant(
          erc1155.totalCirculatingSupply,
          "Contract instance does not support totalCirculatingSupply",
        );
        requiredParamInvariant(tokenId, "No tokenId provided");
        return await erc1155.totalCirculatingSupply(tokenId);
      }
      if (erc721) {
        invariant(
          erc721.totalCirculatingSupply,
          "Contract instance does not support totalCirculatingSupply",
        );
        return await erc721.totalCirculatingSupply();
      }
      invariant(false, "Unknown NFT type");
    },
    {
      enabled: !!erc721 || (!!erc1155 && tokenId !== undefined),
    },
  );
}

/**
 * Hook for accessing a list of NFTs owned by a single wallet address.
 *
 * Available to use on smart contracts that implement either ERC721Enumerable, ERC1155Enumerable, or ERC721Supply extensions.
 *
 * @example
 *
 * ```jsx
 * import { useOwnedNFTs, useContract, useAddress } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const address = useAddress();
 *   const { contract } = useContract(contractAddress);
 *   const { data, isLoading, error } = useOwnedNFTs(contract, address);
 * }
 * ```
 *
 * @param contract - an instance of a `NFTContract`
 * @param ownerWalletAddress -
 * the wallet address to get owned tokens for. Likely, you will want to view the connected wallet’s NFTs. use the `useAddress` hook to get this value.
 *
 * @param queryParams - query params to pass to the query for pagination
 *
 * @returns a response object that includes the list of owned `NFT` objects
 *
 * @twfeature ERC721Enumerable | ERC1155Enumerable | ERC721Supply
 * @nft
 */
export function useOwnedNFTs<TContract extends NFTContract>(
  contract: RequiredParam<TContract>,
  ownerWalletAddress: RequiredParam<WalletAddress>,
  queryParams?: QueryAllParams,
) {
  const contractAddress = contract?.getAddress();
  const { erc721, erc1155 } = getErcs(contract);

  return useQueryWithNetwork<NFT[]>(
    cacheKeys.contract.nft.query.owned.all(contractAddress, ownerWalletAddress),
    async () => {
      requiredParamInvariant(contract, "No Contract instance provided");
      invariant(ownerWalletAddress, "No wallet address provided");
      if (erc721) {
        return await erc721.getOwned(ownerWalletAddress, queryParams);
      }
      if (erc1155) {
        return await erc1155.getOwned(ownerWalletAddress, queryParams);
      }
      invariant(false, "Unknown NFT type");
    },
    {
      enabled: (!!erc721 || !!erc1155) && !!ownerWalletAddress,
    },
  );
}

/**
 * Hook to get the quantity a user owns of a specific ERC1155 NFT.
 *
 * Available to use on smart contracts that implement the `ERC1155` standard.
 *
 * @example
 *
 * ```jsx
 * import { useNFTBalance, useContract } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress);
 *   const { isLoading, data, error } = useNFTBalance(
 *     contract,
 *     "{{wallet_address}}",
 *     "{{token_id}}",
 *   );
 * }
 * ```
 *
 * @param contract - an instance of a {@link NFTContract}
 * @param ownerWalletAddress - the wallet address to check the balance of. Use the `useAddress` hook to get the current wallet address.
 * @param tokenId - required for ERC1155, the tokenId to look up
 * @returns The hook's `data` property, once loaded, returns a `BigNumber` representing the quantity of the NFT owned by the wallet.
 * @twfeature ERC721 | ERC1155
 * @nft
 */
export function useNFTBalance(
  contract: RequiredParam<NFTContract>,
  ownerWalletAddress: RequiredParam<WalletAddress>,
  tokenId?: RequiredParam<BigNumberish>,
) {
  const contractAddress = contract?.getAddress();
  const { erc721, erc1155 } = getErcs(contract);
  return useQueryWithNetwork(
    cacheKeys.contract.nft.balanceOf(
      contractAddress,
      ownerWalletAddress,
      tokenId,
    ),
    () => {
      requiredParamInvariant(contract, "No Contract instance provided");

      invariant(ownerWalletAddress, "No owner wallet address provided");
      if (erc1155) {
        requiredParamInvariant(tokenId, "No tokenId provided");
        invariant(
          erc1155.balanceOf,
          "Contract instance does not support balanceOf",
        );
        return erc1155.balanceOf(ownerWalletAddress, tokenId);
      }
      if (erc721) {
        invariant(
          erc721.balanceOf,
          "Contract instance does not support balanceOf",
        );
        return erc721.balanceOf(ownerWalletAddress);
      }
      invariant(false, "Unknown NFT type");
    },
    {
      enabled: !!erc721 || (!!erc1155 && !!ownerWalletAddress),
    },
  );
}

/**
 * Get the shared metadata of an Open Edition NFT contract
 *
 * @example
 * ```javascript
 * const { data: sharedMetadata, isLoading, error } = useSharedMetadata(contract);
 * ```
 *
 * @param contract - an instance of a `NFTContract`
 * @returns a response object that includes the shared metadata of the contract
 * @twfeature ERC721SharedMetadata
 * @nft
 */
export function useSharedMetadata(
  contract: RequiredParam<NFTContract>,
): UseQueryResult<BasicNFTInput | undefined> {
  const contractAddress = contract?.getAddress();
  const { erc721 } = getErcs(contract);
  return useQueryWithNetwork(
    cacheKeys.contract.nft.sharedMetadata.get(contractAddress),
    () => {
      requiredParamInvariant(contract, "No Contract instance provided");
      if (erc721) {
        invariant(
          erc721.sharedMetadata.get,
          "Contract instance does not support sharedMetadata.get",
        );
        return erc721.sharedMetadata.get();
      }
      invariant(false, "Unknown NFT type");
    },
    {
      enabled: !!contract,
    },
  );
}

/** **********************/
/**     WRITE HOOKS     **/
/** **********************/

/**
 * Hook for minting a new NFT on a smart contract.
 *
 * Available to use on smart contracts that implement the `ERC721`
 * or `ERC1155` standard.
 *
 * By default, the process uploads and pins the NFT metadata to IPFS before minting.
 *
 * @example
 *
 * ```jsx
 * import { useMintNFT, useContract, Web3Button } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress);
 *   const { mutateAsync: mintNft, isLoading, error } = useMintNFT(contract);
 *
 *   return (
 *     <Web3Button
 *       contractAddress={contractAddress}
 *       action={() =>
 *         mintNft({
 *           metadata: {
 *             name: "My NFT",
 *             description: "This is my NFT",
 *             image: "ipfs://example.com/my-nft.png", // Accepts any URL or File type
 *           },
 *           to: "{{wallet_address}}", // Use useAddress hook to get current wallet address
 *         })
 *       }
 *     >
 *       Mint NFT
 *     </Web3Button>
 *   );
 * }
 * ```
 *
 * @param contract - an instance of a {@link NFTContract}
 * @returns a mutation object that can be used to mint a new NFT token to the connected wallet
 *
 * #### metadata
 * The metadata of the NFT to mint.
 *
 * By default, the `metadata` object is uploaded and pinned to IPFS before minting.
 *
 * You can override this behavior by providing a `string` to the metadata property. The string must be a URL that points to a valid JSON object containing [standard metadata properties](https://docs.opensea.io/docs/metadata-standards)
 *
 * ```jsx
 * import { useMintNFT, useContract, Web3Button } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress);
 *   const { mutateAsync: mintNft, isLoading, error } = useMintNFT(contract);
 *
 *   return (
 *     <Web3Button
 *       contractAddress={contractAddress}
 *       action={() =>
 *         mintNft({
 *           // Any valid IPFS or HTTP URL that points to a JSON object
 *           metadata: {
 *             name: "My NFT",
 *             description: "This is my NFT",
 *             image: "ipfs://example.com/my-nft.png", // Accepts any URL or File type
 *           },
 *           to: "{{wallet_address}}",
 *         })
 *       }
 *     >
 *       Mint NFT
 *     </Web3Button>
 *   );
 * }
 * ```
 *
 * #### to (required)
 *
 * The wallet address to mint the NFT to.
 *
 * Likely, you will want to mint the NFT to the currently connected wallet address.
 * Use the `useAddress` hook to get this value.
 *
 * @twfeature ERC721Mintable | ERC1155Mintable
 * @nft
 */
export function useMintNFT<TContract extends NFTContract>(
  contract: RequiredParam<TContract>,
) {
  const activeChainId = useSDKChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();
  const { erc1155, erc721 } = getErcs(contract);

  return useMutation(
    async (data: MintNFTParams) => {
      invariant(data.to, 'No "to" address provided');
      requiredParamInvariant(contract, "contract is undefined");
      if (erc1155) {
        invariant("supply" in data, "supply not provided");
        const { to, metadata, supply } = data;
        return (await erc1155.mintTo(to, {
          metadata,
          supply: BigNumber.from(supply || 1),
        })) as MintNFTReturnType<TContract>;
      }
      if (erc721) {
        return (await erc721.mintTo(
          data.to,
          data.metadata,
        )) as MintNFTReturnType<TContract>;
      }
      invariant(false, "Unknown NFT type");
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
 * Hook for minting additional supply to an _existing_ ERC-1155 token.
 *
 * Available to use on contracts that implement the
 * [ERC1155Mintable](https://portal.thirdweb.com/solidity/extensions/erc1155mintable)
 * interface, such as the [Edition](https://thirdweb.com/thirdweb.eth/TokenERC1155) or [Edition Drop](https://thirdweb.com/thirdweb.eth/DropERC1155).
 *
 * The wallet address that initiates this transaction must have minting permissions on the contract.
 *
 * @example
 *
 * ```jsx
 * import { useContract, useMintNFTSupply, Web3Button } from "@thirdweb-dev/react";
 *
 * const contractAddress = "{{contract_address}}";
 * const walletAddress = "{{wallet_address}}";
 * const tokenId = "{{token_id}}";
 * const additionalSupply = "{{additional_supply}}";
 *
 * function App() {
 *   // Contract must be an ERC-1155 contract that implements the ERC1155Mintable interface
 *   const { contract } = useContract(contractAddress);
 *   const {
 *     mutateAsync: mintNftSupply,
 *     isLoading,
 *     error,
 *   } = useMintNFTSupply(contract);
 *
 *   return (
 *     <Web3Button
 *       contractAddress={contractAddress}
 *       action={() =>
 *         mintNftSupply({
 *           additionalSupply: additionalSupply, // Quantity to mint
 *           to: walletAddress, // Address to mint to
 *           tokenId: tokenId, // Token ID to add supply to
 *         })
 *       }
 *     >
 *       Mint NFT Supply
 *     </Web3Button>
 *   );
 * }
 * ```
 *
 * @param contract - an instance of a `Erc1155`
 *
 * @returns a mutation object that can be used to mint a more supply of a token id to the provided wallet
 * #### additionalSupply (required)
 *
 * The quantity of additional supply to mint.
 *
 * For example, if you have 10 quantity so far, and you want to mint 5 more, set `additionalSupply` to `5`.
 *
 * Can be a `string` or `number`.
 *
 *
 * #### to (required)
 *
 * The wallet address to mint the new supply to.
 *
 * To use the connected wallet address, use the `useAddress` hook.
 *
 *
 * #### tokenId (required)
 *
 * The token ID of the NFT to mint additional supply to.
 *
 * Can be a `string` or `number`.
 *
 * @twfeature ERC1155Mintable
 * @nft
 */
export function useMintNFTSupply(contract: Erc1155) {
  const activeChainId = useSDKChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();

  return useMutation(
    async (data: MintNFTSupplyParams) => {
      invariant(data.to, 'No "to" address provided');
      requiredParamInvariant(contract, "contract is undefined");

      requiredParamInvariant(data.tokenId, "tokenId not provided");
      invariant("additionalSupply" in data, "additionalSupply not provided");
      const { to, tokenId, additionalSupply } = data;
      return await contract.mintAdditionalSupplyTo(
        to,
        tokenId,
        additionalSupply,
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
 * Hook for transferring ERC721 or ERC1155 NFTs to another wallet address.
 *
 * Available to use on contracts that implement either the
 * [ERC721](https://portal.thirdweb.com/solidity/extensions/erc721)
 * and [ERC1155](https://portal.thirdweb.com/solidity/extensions/erc1155)
 * interfaces, such as the [Edition](https://thirdweb.com/thirdweb.eth/TokenERC1155)
 * or [NFT Collection](https://thirdweb.com/thirdweb.eth/TokenERC721).
 *
 * The wallet address that initiates this transaction must have transfer permissions on the contract (i.e. the tokens are not soulbound).
 * It also must have the required amount of token(s) available to transfer.
 *
 * @example
 *
 * ```jsx
 * import { useContract, useTransferNFT, Web3Button } from "@thirdweb-dev/react";
 *
 * // Your NFT collection contract address
 * const contractAddress = "{{contract_address}}";
 * const walletAddress = "{{wallet_address}}";
 * const tokenId = "{{token_id}}";
 *
 * function App() {
 *   // Contract must be an ERC-721 or ERC-1155 contract
 *   const { contract } = useContract(contractAddress);
 *   const {
 *     mutateAsync: transferNFT,
 *     isLoading,
 *     error,
 *   } = useTransferNFT(contract);
 *
 *   return (
 *     <Web3Button
 *       contractAddress={contractAddress}
 *       action={() =>
 *         transferNFT({
 *           to: walletAddress, // Address to transfer the token to
 *           tokenId: tokenId, // Token ID to transfer
 *         })
 *       }
 *     >
 *       Transfer
 *     </Web3Button>
 *   );
 * }
 * ```
 *
 * @param contract - an instance of a {@link NFTContract}
 *
 * @returns a mutation object that can be used to transfer NFTs
 * #### to (required)
 *
 * The wallet address to transfer the token(s) to.
 *
 * To use the connected wallet address, use the `useAddress` hook.
 *
 *
 * #### tokenId (required)
 *
 * The token ID of the NFT to transfer.
 *
 * Can be a `string` or `number`.
 *
 *
 * #### amount (ERC1155 only)
 *
 * If you are using an ERC1155 contract, specify the amount of tokens to transfer.
 *
 * @twfeature ERC721 | ERC1155
 * @nft
 */
export function useTransferNFT<TContract extends NFTContract>(
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
  TransferNFTParams,
  unknown
> {
  const activeChainId = useSDKChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();
  const { erc1155, erc721 } = getErcs(contract);

  return useMutation(
    (data: TransferNFTParams) => {
      invariant("to" in data, "to not provided");
      if (erc1155) {
        invariant(erc1155.transfer, "contract does not support transfer");
        requiredParamInvariant(data.tokenId, "tokenId not provided");
        invariant("amount" in data, "amount not provided");
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return erc1155.transfer(data.to, data.tokenId, data.amount!);
      }
      if (erc721) {
        return erc721.transfer(data.to, data.tokenId);
      }
      invariant(false, "Unknown NFT type");
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
 * Hook for airdropping ERC1155 NFT tokens to multiple wallet addresses at once.
 *
 * Available to use on smart contracts that implement the `ERC1155` standard.
 *
 * Performs a batch transfer from the connected wallet to the specified addresses.
 * This means you need to have the total number of tokens you wish to airdrop available in the wallet that performs this transaction.
 *
 * @example
 *
 * ```jsx
 * import { useAirdropNFT, useContract, Web3Button } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress);
 *   const { mutateAsync: airdropNft, isLoading, error } = useAirdropNFT(contract);
 *
 *   return (
 *     <Web3Button
 *       contractAddress={contractAddress}
 *       action={() =>
 *         airdropNft({
 *           addresses: [
 *             {
 *               address: "0x123",
 *               quantity: 1,
 *             },
 *           ],
 *           tokenId: tokenId,
 *         })
 *       }
 *     >
 *       Airdrop NFT
 *     </Web3Button>
 *   );
 * }
 * ```
 *
 * @param contract - an instance of a `Erc1155`
 * @returns a mutation object that can be used to transfer batch NFTs
 *
 * #### tokenId
 *
 * The token ID of the NFT to airdrop.
 *
 * #### addresses
 *
 * An array of objects containing an `address` and `quantity` of NFTs to airdrop to each address.
 *
 * @twfeature ERC1155
 * @nft
 */
export function useAirdropNFT(contract: Erc1155) {
  const activeChainId = useSDKChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();

  return useMutation(
    ({ tokenId, addresses }: AirdropNFTParams) => {
      requiredParamInvariant(contract, "contract is undefined");
      invariant(contract.airdrop, "contract does not support airdrop");

      return contract.airdrop(tokenId, addresses);
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
 * Hook for burning a NFT on a smart contract.
 *
 * Available to use on smart contracts that implement the `ERC721`
 * or `ERC1155` standard.
 *
 * @example
 *
 * ```jsx
 * import { useBurnNFT, useContract, Web3Button } from "@thirdweb-dev/react";
 *
 * // Your smart contract address
 * const contractAddress = "{{contract_address}}";
 * // The tokenId of the NFT you want to burn
 * const tokenIdToBurn = "{{tokenId}}}}";
 * const amount = 1;
 *
 * function App() {
 *   const { contract } = useContract(contractAddress);
 *   const { mutateAsync: burnNft, isLoading, error } = useBurnNFT(contract);
 *
 *   return (
 *     <Web3Button
 *       contractAddress={contractAddress}
 *       action={() =>
 *         burnNft({
 *           tokenId: tokenIdToBurn,
 *           amount: amount,
 *         })
 *       }
 *     >
 *       Burn NFT
 *     </Web3Button>
 *   );
 * }
 * ```
 *
 * @param contract - an instance of a `NFTContract`
 * @returns a mutation object that can be used to burn an NFT token from the connected wallet
 *
 * #### tokenId
 *
 * The token ID of the NFT you want to burn.
 *
 * #### amount (optional)
 *
 * When using ERC1155 NFTs, you can specify the quantity you want to burn.
 *
 * Defaults value is `1`
 *
 * @twfeature ERC721Burnable | ERC1155Burnable
 * @nft
 */
export function useBurnNFT<TContract extends NFTContract>(
  contract: RequiredParam<TContract>,
) {
  const activeChainId = useSDKChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();
  const { erc1155, erc721 } = getErcs(contract);

  return useMutation(
    async (data: BurnNFTParams) => {
      requiredParamInvariant(data.tokenId, "No tokenId provided");
      requiredParamInvariant(contract, "contract is undefined");
      if (erc1155) {
        invariant("amount" in data, "amount not provided");
        const { tokenId, amount } = data;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return await erc1155.burn(tokenId, amount!);
      }
      if (erc721) {
        const { tokenId } = data;
        return await erc721.burn(tokenId);
      }
      invariant(false, "Unknown NFT type");
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
 * Set shared metadata
 * TODO add docs
 * @internal
 */
export function useSetSharedMetadata<TContract extends NFTContract>(
  contract: RequiredParam<TContract>,
) {
  const activeChainId = useSDKChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();
  const { erc721 } = getErcs(contract);

  return useMutation(
    async (data: BasicNFTInput) => {
      if (erc721) {
        return await erc721.sharedMetadata.set(data);
      }
      invariant(false, "Unknown NFT type");
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

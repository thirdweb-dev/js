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
 * Get a single NFT
 *
 * @example
 * ```javascript
 * const tokenId = 0; // the tokenId to look up
 * const { data: nft, isLoading, error } = useNFT(contract, tokenId);
 * ```
 *
 * @param contract - an instance of a {@link NFTContract}
 * @param tokenId - the tokenId to look up
 * @returns a response object that includes the metadata for the given tokenId
 * @twfeature ERC721 | ERC1155
 * @tags nft
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
 * Get all NFTs
 *
 * @example
 * ```javascript
 * const { data: nfts, isLoading, error } = useNFTs(contract, { start: 0, count: 100 });
 * ```
 *
 * @param contract - an instance of a {@link NFTContract}
 * @param queryParams - query params to pass to the query for pagination
 * @returns a response object that includes an array of NFTs
 * @twfeature ERC721Supply | ERC721Enumerable | ERC1155Enumerable
 * @tags nft
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
 * Get total supply count
 *
 * @example
 * ```javascript
 * const { contract } = useContract("{{contract_address}}");
 * const { data: count, isLoading, error } = useTotalCount(contract);
 * ```
 *
 * @param contract - an instance of a {@link NFTContract}
 * @returns a response object that includes the total count of NFTs
 * @twfeature ERC721Supply | ERC1155Enumerable
 * @tags nft
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
 * Get total minted supply count
 *
 * @example
 * ```javascript
 * const { contract } = useContract("{{contract_address}}");
 * const { data: totalCirculatingSupply, isLoading, error } = useTotalCirculatingSupply(contract);
 * ```
 *
 * @param contract - an instance of a {@link NFTContract}
 * @param tokenId - required for ERC1155, the tokenId to look up
 * @returns a response object that includes the total minted supply
 * @twfeature ERC721Supply | ERC1155Enumerable
 * @tags nft
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
 * Get all NFTs owned by a specific wallet
 *
 * @example
 * ```javascript
 * const { data: ownedNFTs, isLoading, error } = useOwnedNFTs(contract, "{{wallet_address}}", { start: 0, count: 100 });
 * ```
 *
 * @param contract - an instance of a {@link NFTContract}
 * @param ownerWalletAddress - the wallet address to get owned tokens for
 * @param queryParams - query params to pass to the query for pagination
 * @returns a response object that includes the list of owned tokens
 * @twfeature ERC721Enumerable | ERC1155Enumerable | ERC721Supply
 * @tags nft
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
 * Get NFT balance of a specific wallet
 *
 * @example
 * ```javascript
 * const { data: ownerBalance, isLoading, error } = useNFTBalance(contract, "{{wallet_address}}");
 * // for ERC1155 contracts, you can also pass a tokenId
 * const tokenId = 0;
 * const { data: ownerBalance, isLoading, error } = useNFTBalance(contract, "{{wallet_address}}", tokenId);
 * ```
 *
 * @param contract - an instance of a {@link NFTContract}
 * @param ownerWalletAddress - the wallet address to check the balance of
 * @param tokenId - required for ERC1155, the tokenId to look up
 * @returns a response object that includes the total balance of the owner
 * @twfeature ERC721 | ERC1155
 * @tags nft
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
 * @param contract - an instance of a {@link NFTContract}
 * @returns a response object that includes the shared metadata of the contract
 * @twfeature ERC721SharedMetadata
 * @see {@link https://portal.thirdweb.com/react/react.usesharedmetadata?utm_source=sdk | Documentation}
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
 * Mint an NFT to a specific wallet
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const { contract } = useContract("{{contract_address}}");
 *   const {
 *     mutate: mintNft,
 *     isLoading,
 *     error,
 *   } = useMintNFT(contract);
 *
 *   if (error) {
 *     console.error("failed to mint NFT", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => mintNft({ name: "My awesome NFT!", to: "{{wallet_address}}" })}
 *     >
 *       Mint!
 *     </button>
 *   );
 * };
 * ```
 *
 * @param contract - an instance of a {@link NFTContract}
 * @returns a mutation object that can be used to mint a new NFT token to the connected wallet
 * @twfeature ERC721Mintable | ERC1155Mintable
 * @tags nft
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
 * Increase the supply of an existing NFT
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const { contract } = useContract("{{contract_address}}");
 *   const {
 *     mutate: mintNftSupply,
 *     isLoading,
 *     error,
 *   } = useMintNFTSupply(contract);
 *
 *   if (error) {
 *     console.error("failed to mint additional supply", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => mintNftSupply({ tokenId: 0, additionalSupply: 100, to: "{{wallet_address}}"})}
 *     >
 *       Mint Additional Supply!
 *     </button>
 *   );
 * };
 * ```
 *
 * @param contract - an instance of a {@link Erc1155}
 * @returns a mutation object that can be used to mint a more supply of a token id to the provided wallet
 * @twfeature ERC1155Mintable
 * @tags nft
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
 * Transfer an NFT
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const { contract } = useContract("{{contract_address}}");
 *   const {
 *     mutate: transferNFT,
 *     isLoading,
 *     error,
 *   } = useTransferNFT(contract);
 *
 *   if (error) {
 *     console.error("failed to transfer NFT", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => transferNFT({
 *         to: "{{wallet_address}}",
 *         tokenId: 2
 *       })}
 *     >
 *       Transfer
 *     </button>
 *   );
 * };
 * ```
 *
 * @param contract - an instance of a {@link NFTContract}
 * @returns a mutation object that can be used to transfer NFTs
 * @twfeature ERC721 | ERC1155
 * @tags nft
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
 * Airdrop NFTs to a list of wallets
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const { contract } = useContract("{{contract_address}}");
 *   const {
 *     mutate: airdropNFT,
 *     isLoading,
 *     error,
 *   } = useAirdropNFT(contract);
 *
 *   if (error) {
 *     console.error("failed to transfer batch NFTs", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => airdropNFT({
 *          tokenId: 2,
 *          addresses: [
 *            { address: "{{wallet_address}}", quantity: 2 },
 *            { address: "{{wallet_address}}", quantity: 4 } }
 *          ]
 *       )}
 *     >
 *       Airdrop NFT
 *     </button>
 *   );
 * };
 * ```
 *
 * @param contract - an instance of a {@link Erc1155}
 * @returns a mutation object that can be used to transfer batch NFTs
 * @twfeature ERC1155
 * @tags nft
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
 * Burn an NFT
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const { contract } = useContract("{{contract_address}}");
 *   const {
 *     mutate: burnNFT,
 *     isLoading,
 *     error,
 *   } = useBurnNFT(contract);
 *
 *   if (error) {
 *     console.error("failed to burn NFT", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => burnNFT({ tokenId: 0, amount: 1 })}
 *     >
 *       Burn!
 *     </button>
 *   );
 * };
 * ```
 *
 * @param contract - an instance of a {@link NFTContract}
 * @returns a mutation object that can be used to burn an NFT token from the connected wallet
 * @twfeature ERC721Burnable | ERC1155Burnable
 * @tags nft
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

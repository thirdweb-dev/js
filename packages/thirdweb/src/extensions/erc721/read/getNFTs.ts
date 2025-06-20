import { getContractNFTs } from "../../../insight/index.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { min } from "../../../utils/bigint.js";
import type { NFT } from "../../../utils/nft/parseNft.js";
import { startTokenId } from "../__generated__/IERC721A/read/startTokenId.js";
import {
  isTotalSupplySupported,
  totalSupply,
} from "../__generated__/IERC721A/read/totalSupply.js";
import {
  isNextTokenIdToMintSupported,
  nextTokenIdToMint,
} from "../__generated__/IERC721Enumerable/read/nextTokenIdToMint.js";
import { getNFT, isGetNFTSupported } from "./getNFT.js";

const DEFAULT_QUERY_ALL_COUNT = 100n;

/**
 * Parameters for retrieving NFTs.
 * @extension ERC721
 */
export type GetNFTsParams = {
  /**
   * Which tokenId to start at.
   * @default 0
   */
  start?: number;
  /**
   * The number of NFTs to retrieve.
   * @default 100
   */
  count?: number;
  /**
   * Whether to include the owner of each NFT.
   * @default false
   */
  includeOwners?: boolean;
  /**
   * Whether to check and fetch tokenID by index, in case of non-sequential IDs.
   *
   * It should be set to true if it's an ERC721Enumerable contract, and has `tokenByIndex` function.
   * In this case, the provided tokenId will be considered as token-index and actual tokenId will be fetched from the contract.
   */
  tokenByIndex?: boolean;
  /**
   * Whether to use the insight API to fetch the NFTs.
   * @default true
   */
  useIndexer?: boolean;
};

/**
 * Retrieves an array of NFTs ("ERC721") based on the provided options.
 * @param options - The options for retrieving the NFTs.
 * @returns A promise that resolves to an array of NFTs.
 * @throws An error if the contract requires either `nextTokenIdToMint` or `totalSupply` function to determine the next token ID to mint.
 * @extension ERC721
 * @example
 * ```ts
 * import { getNFTs } from "thirdweb/extensions/erc721";
 * const nfts = await getNFTs({
 *  contract,
 *  start: 0,
 *  count: 10,
 * });
 * ```
 */
export async function getNFTs(
  options: BaseTransactionOptions<GetNFTsParams>,
): Promise<NFT[]> {
  const { useIndexer = true } = options;
  if (useIndexer) {
    try {
      return await getNFTsFromInsight(options);
    } catch {
      return await getNFTsFromRPC(options);
    }
  }
  return await getNFTsFromRPC(options);
}

/**
 * Checks if the `getNFTs` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getNFTs` method is supported.
 * @extension ERC721
 * @example
 * ```ts
 * import { isGetNFTsSupported } from "thirdweb/extensions/erc721";
 *
 * const supported = isGetNFTsSupported(["0x..."]);
 * ```
 */
export function isGetNFTsSupported(availableSelectors: string[]) {
  return (
    isGetNFTSupported(availableSelectors) &&
    (isTotalSupplySupported(availableSelectors) ||
      isNextTokenIdToMintSupported(availableSelectors))
  );
}

async function getNFTsFromInsight(
  options: BaseTransactionOptions<GetNFTsParams>,
): Promise<NFT[]> {
  const { contract, start, count = Number(DEFAULT_QUERY_ALL_COUNT) } = options;

  const [result, supplyInfo] = await Promise.all([
    getContractNFTs({
      chains: [contract.chain],
      client: contract.client,
      contractAddress: contract.address,
      includeOwners: options.includeOwners ?? false,
      queryOptions: {
        limit: count,
        page: start ? Math.floor(start / count) : undefined,
      },
    }),
    getSupplyInfo(options).catch(() => ({
      maxSupply: 0,
      startTokenId: 0,
    })),
  ]);

  const currentOffset = start ?? 0;
  const expectedResultLength = Math.min(
    count,
    Math.max(
      0,
      Number(supplyInfo.maxSupply) -
        Number(supplyInfo.startTokenId) -
        currentOffset,
    ),
  );
  if (result.length < expectedResultLength) {
    try {
      // fresh contracts might be delayed in indexing, so we fallback to RPC
      // must use await here
      return await getNFTsFromRPC(options);
    } catch {
      // if RPC fails, we return the result from insight
      return result;
    }
  }

  return result;
}

async function getNFTsFromRPC(
  options: BaseTransactionOptions<GetNFTsParams>,
): Promise<NFT[]> {
  const { startTokenId, maxSupply } = await getSupplyInfo(options);
  const start = BigInt(options.start ?? 0) + startTokenId;
  const count = BigInt(options.count ?? DEFAULT_QUERY_ALL_COUNT);
  const maxId = min(maxSupply, start + count);
  const promises: ReturnType<typeof getNFT>[] = [];

  for (let i = start; i < maxId; i++) {
    promises.push(
      getNFT({
        ...options,
        includeOwner: options.includeOwners ?? false,
        tokenId: i,
        useIndexer: false,
      }),
    );
  }

  return await Promise.all(promises);
}

async function getSupplyInfo(options: BaseTransactionOptions<GetNFTsParams>) {
  const [startTokenId_, maxSupply] = await Promise.allSettled([
    startTokenId(options),
    nextTokenIdToMint(options),
    totalSupply(options),
  ]).then(([_startTokenId, _next, _total]) => {
    // default to 0 if startTokenId is not available
    const startTokenId__ =
      _startTokenId.status === "fulfilled" ? _startTokenId.value : 0n;
    let maxSupply_: bigint;
    // prioritize nextTokenIdToMint
    if (_next.status === "fulfilled") {
      // because we always default the startTokenId to 0 we can safely just always subtract here
      maxSupply_ = _next.value - startTokenId__;
    }
    // otherwise use totalSupply
    else if (_total.status === "fulfilled") {
      maxSupply_ = _total.value;
    } else {
      throw new Error(
        "Contract requires either `nextTokenIdToMint` or `totalSupply` function available to determine the next token ID to mint",
      );
    }
    return [startTokenId__, maxSupply_] as const;
  });

  return {
    maxSupply,
    startTokenId: startTokenId_,
  };
}

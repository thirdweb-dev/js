import type { BaseTransactionOptions } from "../../transaction/types.js";
import type { NFT } from "../../utils/nft/parseNft.js";
import { isERC721 } from "../erc721/read/isERC721.js";
import { isERC1155 } from "../erc1155/read/isERC1155.js";
import type { ListingStatus } from "./types.js";

type GetAssetParams = {
  tokenId: bigint;
};

/**
 * Retrieves the NFT asset based on the provided options.
 * @param options The transaction options.
 * @returns A promise that resolves to the NFT asset.
 * @example
 * ```ts
 * import { getNFTAsset } from "thirdweb/extensions/marketplace";
 *
 * const nft = await getNFTAsset({ contract, tokenId: 1n });
 * ```
 */
export async function getNFTAsset(
  options: BaseTransactionOptions<GetAssetParams>,
): Promise<NFT> {
  const [erc721, erc1155] = await Promise.all([
    isERC721(options),
    isERC1155(options),
  ]);
  switch (true) {
    case erc721: {
      const { getNFT } = await import("../erc721/read/getNFT.js");
      return getNFT(options);
    }
    case erc1155: {
      const { getNFT } = await import("../erc1155/read/getNFT.js");
      return getNFT(options);
    }
    default: {
      throw new Error("Contract is neither ERC721 nor ERC1155.");
    }
  }
}

export function computeStatus(options: {
  listingStatus: number;
  blockTimeStamp: bigint;
  startTimestamp: bigint;
  endTimestamp: bigint;
}): ListingStatus {
  switch (options.listingStatus) {
    case 1: {
      if (options.startTimestamp > options.blockTimeStamp) {
        return "CREATED";
      }
      if (options.endTimestamp < options.blockTimeStamp) {
        return "EXPIRED";
      }
      return "ACTIVE";
    }
    case 2: {
      return "COMPLETED";
    }
    case 3: {
      return "CANCELLED";
    }
    default: {
      throw new Error(`Invalid listing status: "${options.listingStatus}"`);
    }
  }
}

/**
 * @internal
 */
export async function getAllInBatches<const T>(
  fn: (start: bigint, end: bigint) => Promise<T>,
  options: {
    start: bigint;
    end: bigint;
    maxSize: bigint;
  },
): Promise<T[]> {
  let start = options.start;
  const batches: Promise<T>[] = [];
  while (options.end - start > options.maxSize) {
    batches.push(fn(start, options.end + options.maxSize - 1n));
    start += options.maxSize;
  }
  batches.push(fn(start, options.end - 1n));

  return await Promise.all(batches);
}

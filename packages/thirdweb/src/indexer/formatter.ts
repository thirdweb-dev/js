import { BigNumber } from "ethers";
import {
  type GetBlockReturnType,
  type Transaction,
  formatBlock,
  formatTransaction,
} from "viem";
import type { Hex } from "../utils/encoding/hex.js";
import { type NFT, parseNFT } from "../utils/nft/parseNft.js";
import type { Block, NFTsData, Transactions } from "./types.js";

export const formatChainsawBlock = (
  block?: Block,
): GetBlockReturnType<undefined, false> | undefined => {
  if (!block) return;
  return formatBlock({
    ...block,
    baseFeePerGas:
      `0x${BigNumber.from(block.baseFeePerGas).toHexString()}` as Hex,
    difficulty: `0x${BigNumber.from(block.difficulty).toHexString()}` as Hex,
    gasLimit: `0x${BigNumber.from(block.gasLimit).toHexString()}` as Hex,
    gasUsed: `0x${BigNumber.from(block.gasUsed).toHexString()}` as Hex,
  }) as GetBlockReturnType<undefined, false>;
};

export const formatChainsawNFTs = (nfts?: NFTsData): NFT[] | undefined => {
  if (!nfts) return;
  return nfts.map((nft) => {
    const options =
      nft.type === "ERC1155"
        ? {
            tokenId: BigInt(nft.tokenId),
            owner: nft.ownerAddress || null,
            tokenUri: nft.uri,
            type: "ERC1155" as const,
            supply: BigInt(nft.balance || 0),
          }
        : {
            tokenId: BigInt(nft.tokenId),
            owner: nft.ownerAddress || null,
            tokenUri: nft.uri,
            type: "ERC721" as const,
          };
    return parseNFT(
      {
        id: BigInt(nft.tokenId),
        uri: nft.uri,
      },
      options,
    );
  });
};

export const formatChainsawTransactions = (
  txs?: Transactions,
): Transaction[] | undefined => {
  if (!txs) return;
  return txs.map((tx) => {
    if (tx.type === 0) {
      return formatTransaction({
        ...tx,
        type: "0x0",
        blockNumber: `0x${BigNumber.from(tx.blockNumber).toHexString()}` as Hex,
        value: `0x${BigNumber.from(tx.value).toHexString()}` as Hex,
        gasPrice: undefined,
        maxPriorityFeePerGas: undefined,
      });
    }
    if (tx.type === 1) {
      return formatTransaction({
        ...tx,
        type: "0x1",
        blockNumber: `0x${BigNumber.from(tx.blockNumber).toHexString()}` as Hex,
        value: `0x${BigNumber.from(tx.value).toHexString()}` as Hex,
        gasPrice: `0x${BigNumber.from(tx.gasPrice).toHexString()}` as Hex,
        maxPriorityFeePerGas: undefined,
      });
    }
    if (tx.type === 2) {
      return formatTransaction({
        ...tx,
        type: "0x2",
        blockNumber: `0x${BigNumber.from(tx.blockNumber).toHexString()}` as Hex,
        value: `0x${BigNumber.from(tx.value).toHexString()}` as Hex,
        gasPrice: undefined,
        maxPriorityFeePerGas:
          `0x${BigNumber.from(tx.maxPriorityFeePerGas).toHexString()}` as Hex,
      });
    }
    return formatTransaction({
      ...tx,
      type: "0x3",
      blockNumber: `0x${BigNumber.from(tx.blockNumber).toHexString()}` as Hex,
      value: `0x${BigNumber.from(tx.value).toHexString()}` as Hex,
      gasPrice: undefined,
      maxPriorityFeePerGas:
        `0x${BigNumber.from(tx.maxPriorityFeePerGas).toHexString()}` as Hex,
    });
  });
};

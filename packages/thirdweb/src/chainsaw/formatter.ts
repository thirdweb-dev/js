import { BigNumber } from "ethers";
import { type GetBlockReturnType, formatBlock, formatTransaction } from "viem";
import type { Hex } from "../utils/encoding/hex.js";
import { type NFT, parseNFT } from "../utils/nft/parseNft.js";
import type {
  Block,
  ChainsawTransactions,
  NFTsData,
  Transaction,
  Transactions,
} from "./types.js";

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

export const formatChainsawNFTs = (nfts?: NFTsData): NFT[] => {
  if (!nfts) return [];
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
  txs?: ChainsawTransactions,
): Transactions => {
  if (!txs) return [];
  return txs.map((tx) => {
    if (tx.type === 0) {
      return formatTransaction({
        ...tx,
        type: "0x0",
        blockNumber: BigNumber.from(tx.blockNumber).toHexString() as Hex,
        value: BigNumber.from(tx.value).toHexString() as Hex,
        gasPrice: undefined,
        nonce: BigNumber.from(tx.nonce).toHexString() as Hex,
        maxPriorityFeePerGas: undefined,
        transactionIndex: BigNumber.from(tx.index).toHexString() as Hex,
      }) as Transaction;
    }
    if (tx.type === 1) {
      return formatTransaction({
        ...tx,
        type: "0x1",
        blockNumber: BigNumber.from(tx.blockNumber).toHexString() as Hex,
        value: BigNumber.from(tx.value).toHexString() as Hex,
        gasPrice: BigNumber.from(tx.gasPrice).toHexString() as Hex,
        nonce: BigNumber.from(tx.nonce).toHexString() as Hex,
        maxPriorityFeePerGas: undefined,
        transactionIndex: BigNumber.from(tx.index).toHexString() as Hex,
      }) as Transaction;
    }
    if (tx.type === 2) {
      return formatTransaction({
        ...tx,
        type: "0x2",
        blockNumber: BigNumber.from(tx.blockNumber).toHexString() as Hex,
        transactionIndex: BigNumber.from(tx.index).toHexString() as Hex,
        value: BigNumber.from(tx.value).toHexString() as Hex,
        nonce: BigNumber.from(tx.nonce).toHexString() as Hex,
        gasPrice: undefined,
        maxPriorityFeePerGas: BigNumber.from(
          tx.maxPriorityFeePerGas,
        ).toHexString() as Hex,
      }) as Transaction;
    }
    return formatTransaction({
      ...tx,
      type: "0x3",
      blockNumber: BigNumber.from(tx.blockNumber).toHexString() as Hex,
      value: BigNumber.from(tx.value).toHexString() as Hex,
      gasPrice: undefined,
      nonce: BigNumber.from(tx.nonce).toHexString() as Hex,
      maxPriorityFeePerGas: BigNumber.from(
        tx.maxPriorityFeePerGas,
      ).toHexString() as Hex,
      transactionIndex: BigNumber.from(tx.index).toHexString() as Hex,
    }) as Transaction;
  });
};

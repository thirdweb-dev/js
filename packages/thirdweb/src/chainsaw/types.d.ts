import type { Transaction as ViemTransaction } from "viem";
import type { Hex } from "../utils/encoding/hex.ts";
import type { NFT as ParsedNFT } from "../utils/nft/parseNft.js";
import type { Prettify } from "../utils/type-utils.ts";

export type ChainsawResponse<T = unknown> = {
  data?: T;
  error?: string;
  page?: number;
};

export type ChainsawPagingParams = {
  /**
   * Number of items per page
   */
  pageSize?: number;
  /**
   * Page number
   */
  page?: number;
};

export type Block = {
  hash: Hex;
  blockNumber: number;
  time: Date;
  parentHash: Hex;
  miner: Hex;
  nonce: Hex;
  baseFeePerGas?: string;
  difficulty: string;
  gasLimit: string;
  gasUsed: string;
  chainId: number;
  version: number;
};

export type ChainsawBlock = {
  number: bigint | null;
  hash: Hex | null;
  nonce: Hex | null;
  logsBloom: Hex | null;
  baseFeePerGas: bigint | null;
  blobGasUsed: bigint;
  difficulty: bigint;
  excessBlobGas: bigint;
  extraData: Hex;
  gasLimit: bigint;
  gasUsed: bigint;
  miner: string;
  mixHash: Hex;
  parentHash: Hex;
  receiptsRoot: Hex;
  sealFields: Hex[];
  sha3Uncles: Hex;
  size: bigint;
  stateRoot: Hex;
  timestamp: bigint;
  totalDifficulty: bigint | null;
  transactionsRoot: Hex;
  uncles: Hex[];
  withdrawalsRoot?: Hex;
};

export type Event = {
  name: string;
  count: string;
  time?: string;
  chainId?: number;
  contractAddress?: Hex;
  args?: string;
};

export type Events = Event[];

export type ChainsawEvent = Prettify<
  Omit<Event, "count"> & {
    count: bigint;
  }
>;

export type ChainsawEvents = ChainsawEvent[];

export type DecodedTransaction = {
  functionName: string;
  args?: string;
};

export type ChainsawTransaction = {
  time: Date;
  to: Hex;
  from: Hex;
  hash: Hex;
  index: number;
  blockNumber: number;
  blockHash: Hex;
  data?: string;
  value: string;
  gasLimit: string;
  gasPrice: string;
  gasUsed?: string;
  maxPriorityFeePerGas?: string;
  success: boolean;
  type: number;
  decoded?: DecodedTransaction;
  nonce: string;
};

export type ChainsawTransactions = ChainsawTransaction[];

export type Transaction = Omit<ChainsawTransaction, keyof ViemTransaction> &
  ViemTransaction;
export type Transactions = Transaction[];

export type NFTData = {
  chainId: number;
  contractAddress: Hex;
  tokenId: string;
  latestTransferTime: string;
  collectionName: string;
  uri: string;
  ownerAddress?: Hex;
  balance?: string;
  type: string;
  image?: string;
  imageData?: string;
  name?: string;
  description?: string;
};

export type NFTsData = NFTData[];

export type NFT = ParsedNFT & {
  contractAddress: string;
  collectionName: string;
  chainId: number;
  balance: string;
  imageData?: string;
};

export type NFTs = NFT[];

import type { Transaction as ViemTransaction } from "viem";
import type { Hex } from "../utils/encoding/hex.ts";

export type ChainsawResponse<T = unknown> = {
  data?: T;
  error?: string;
  page?: number;
};

export type ChainsawPagingParams = {
  pageSize?: number;
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

export type Event = {
  name: string;
  count: number;
  time?: string;
  chainId?: number;
  contractAddress?: Hex;
};

export type Events = Event[];

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
};

export type NFTsData = NFTData[];

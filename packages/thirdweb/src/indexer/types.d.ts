import type { Hex } from "../utils/encoding/hex.ts";

export type ChainsawResponse<T> = {
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
  miner: string;
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

export type Transaction = {
  time: Date;
  to: string;
  from: string;
  hash: Hex;
  blockNumber: number;
  data?: string;
  value: string;
  gasLimit: string;
  gasPrice: string;
  gasUsed?: string;
  maxPriorityFeePerGas?: string;
  success: boolean;
  type: number;
  decoded?: DecodedTransaction;
};

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

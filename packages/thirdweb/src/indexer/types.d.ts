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
  hash: string;
  blockNumber: number;
  time: Date;
  parentHash: string;
  miner: string;
  nonce: string;
  baseFeePerGas?: string;
  difficulty: number;
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
  contractAddress?: string;
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
  hash: string;
  blockNumber: number;
  data?: string;
  value: string;
  gasLimit: string;
  gasPrice: string;
  gasUsed: string;
  maxPriorityFeePerGas: string;
  success: boolean;
  type: number;
  decoded?: DecodedTransaction;
};

export type Transactions = Transaction[];

export type NFTData = {
  chainId: number;
  collectionAddress: string;
  tokenId: string;
  latestTransferTime: string;
  collectionName: string;
  uri: string;
  ownerAddress?: string;
  currentBalance?: number;
};

export type NFTsData = NFTData[];

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
  baseFeePerGas?: number;
  difficulty: number;
  gasLimit: number;
  gasUsed: number;
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

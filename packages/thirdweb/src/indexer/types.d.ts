export type ChainsawResponse<T> = {
  data?: T;
  error?: string;
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

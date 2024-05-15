export interface UploadProgressEvent {
  /**
   * The number of bytes uploaded.
   */
  progress: number;

  /**
   * The total number of bytes to be uploaded.
   */
  total: number;
}

/**
 * Standardized return type for contract events that returns event arguments
 */
export type ContractEvent<TEvent = Record<string, any>> = {
  eventName: string;
  data: TEvent;
  // from ethers.providers.Log
  transaction: {
    blockNumber: number;
    blockHash: string;
    transactionIndex: number;

    removed: boolean;

    address: string;
    data: string;

    topics: Array<string>;

    transactionHash: string;
    logIndex: number;
  };
};

/**
 * Filters for querying past events
 */
export interface EventQueryOptions<
  TFilter extends Record<string, any> = Record<string, any>,
> {
  fromBlock?: string | number;
  toBlock?: string | number;
  order?: "asc" | "desc";
  filters?: TFilter;
}

import { providers, utils } from "ethers";

const DEFAULT_BATCH_TIME_LIMIT_MS = 50;
const DEFAULT_BATCH_SIZE_LIMIT = 250;

const DEFAULT_BATCH_OPTIONS = {
  timeLimitMs: DEFAULT_BATCH_TIME_LIMIT_MS,
  sizeLimit: DEFAULT_BATCH_SIZE_LIMIT,
};

export type BatchOptions = Partial<typeof DEFAULT_BATCH_OPTIONS>;

/**
 * mostly copied from ethers.js directly but make it a StaticJsonRpcProvider
 * @internal
 */
export class StaticJsonRpcBatchProvider extends providers.StaticJsonRpcProvider {
  private _timeLimitMs: number;
  private _sizeLimit: number;
  _pendingBatchAggregator: NodeJS.Timer | null;
  _pendingBatch: Array<{
    request: { method: string; params: Array<any>; id: number; jsonrpc: "2.0" };
    resolve: (result: any) => void;
    reject: (error: Error) => void;
  }> | null;

  constructor(
    url: string | utils.ConnectionInfo | undefined,
    network: providers.Networkish | undefined,
    batchOptions: BatchOptions = DEFAULT_BATCH_OPTIONS,
  ) {
    super(url, network);
    this._timeLimitMs = batchOptions.timeLimitMs || DEFAULT_BATCH_SIZE_LIMIT;
    this._sizeLimit = batchOptions.sizeLimit || DEFAULT_BATCH_TIME_LIMIT_MS;
    this._pendingBatchAggregator = null;
    this._pendingBatch = null;
  }

  private sendCurrentBatch(request: any) {
    // if we still have a timeout clear that first
    if (this._pendingBatchAggregator) {
      clearTimeout(this._pendingBatchAggregator);
    }
    // Get the current batch and clear it, so new requests
    // go into the next batch
    const batch = this._pendingBatch || [];
    this._pendingBatch = null;
    this._pendingBatchAggregator = null;

    // Get the request as an array of requests
    const request_ = batch.map((inflight) => inflight.request);

    this.emit("debug", {
      action: "requestBatch",
      request: utils.deepCopy(request),
      provider: this,
    });

    return utils.fetchJson(this.connection, JSON.stringify(request_)).then(
      (result) => {
        this.emit("debug", {
          action: "response",
          request: request_,
          response: result,
          provider: this,
        });

        // For each result, feed it to the correct Promise, depending
        // on whether it was a success or error
        batch.forEach((inflightRequest_, index) => {
          const payload = result[index];

          // there may *not* be a payload for a given request (typically RPC error level)
          if (payload) {
            // if there is a payload, check for an error
            if (payload.error) {
              const error = new Error(payload.error.message);
              (error as any).code = payload.error.code;
              (error as any).data = payload.error.data;
              inflightRequest_.reject(error);
            } else {
              // if there's no error resolve the request
              inflightRequest_.resolve(payload.result);
            }
          } else {
            // if there is no payload, reject the request
            inflightRequest_.reject(new Error("No response for request"));
          }
        });
      },
      (error) => {
        this.emit("debug", {
          action: "response",
          error: error,
          request: request_,
          provider: this,
        });

        // If there was an error, reject all the requests
        batch.forEach((inflightRequest_) => {
          inflightRequest_.reject(error);
        });
      },
    );
  }

  send(method: string, params: Array<any>): Promise<any> {
    const request = {
      method: method,
      params: params,
      id: this._nextId++,
      jsonrpc: "2.0",
    };

    if (this._pendingBatch === null) {
      this._pendingBatch = [];
    }

    const inflightRequest: any = { request, resolve: null, reject: null };

    const promise = new Promise((resolve, reject) => {
      inflightRequest.resolve = resolve;
      inflightRequest.reject = reject;
    });

    this._pendingBatch.push(inflightRequest);

    // if we would go *over* the size limit of the batch with this request, send the batch now
    if (this._pendingBatch.length === this._sizeLimit) {
      this.sendCurrentBatch(request);
    }

    if (!this._pendingBatchAggregator) {
      // Schedule batch for next event loop + short duration
      this._pendingBatchAggregator = setTimeout(() => {
        this.sendCurrentBatch(request);
      }, this._timeLimitMs);
    }

    return promise;
  }
}

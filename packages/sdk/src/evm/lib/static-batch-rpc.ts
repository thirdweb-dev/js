import { providers, utils } from "ethers";


// mostly copied from ethers.js directly but make it a StaticJsonRpcProvider
export class StaticJsonRpcBatchProvider extends providers.StaticJsonRpcProvider {
    _pendingBatchAggregator: NodeJS.Timer | null;
    _pendingBatch: Array<{
        request: { method: string, params: Array<any>, id: number, jsonrpc: "2.0" },
        resolve: (result: any) => void,
        reject: (error: Error) => void
    }> | null;

    constructor(url: string | utils.ConnectionInfo | undefined, network: providers.Networkish | undefined){
      super(url, network);
      this._pendingBatchAggregator = null;
      this._pendingBatch = null;
    }

    send(method: string, params: Array<any>): Promise<any> {
        const request = {
            method: method,
            params: params,
            id: (this._nextId++),
            jsonrpc: "2.0"
        };

        if (this._pendingBatch === null) {
            this._pendingBatch = [ ];
        }

        const inflightRequest: any = { request, resolve: null, reject: null };

        const promise = new Promise((resolve, reject) => {
            inflightRequest.resolve = resolve;
            inflightRequest.reject = reject;
        });

        this._pendingBatch.push(inflightRequest);

        if (!this._pendingBatchAggregator) {
            // Schedule batch for next event loop + short duration
            this._pendingBatchAggregator = setTimeout(() => {

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
                    provider: this
                });

                return utils.fetchJson(this.connection, JSON.stringify(request_)).then((result) => {
                    this.emit("debug", {
                        action: "response",
                        request: request_,
                        response: result,
                        provider: this
                    });

                    // For each result, feed it to the correct Promise, depending
                    // on whether it was a success or error
                    batch.forEach((inflightRequest_, index) => {
                        const payload = result[index];
                        if (payload.error) {
                            const error = new Error(payload.error.message);
                            (<any>error).code = payload.error.code;
                            (<any>error).data = payload.error.data;
                            inflightRequest_.reject(error);
                        } else {
                            inflightRequest_.resolve(payload.result);
                        }
                    });

                }, (error) => {
                    this.emit("debug", {
                        action: "response",
                        error: error,
                        request: request,
                        provider: this
                    });

                    batch.forEach((inflightRequest_) => {
                      inflightRequest_.reject(error);
                    });
                });

            }, 10);
        }

        return promise;
    }
}
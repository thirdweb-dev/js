import type { ThirdwebClient } from "../client/client.js";
import { getClientFetch } from "../utils/fetch.js";
import { stringify } from "../utils/json.js";

export type RpcRequest = {
  jsonrpc?: "2.0";
  method: string;
  params?: any;
  id?: number;
};

type FetchRpcOptions = {
  requests: RpcRequest[];
  requestTimeoutMs?: number;
};

type SuccessResult<T> = {
  method?: never;
  result: T;
  error?: never;
};
type ErrorResult<T> = {
  method?: never;
  result?: never;
  error: T;
};
type Subscription<TResult, TError> = {
  method: "eth_subscription";
  error?: never;
  result?: never;
  params: {
    subscription: string;
  } & (
    | {
        result: TResult;
        error?: never;
      }
    | {
        result?: never;
        error: TError;
      }
  );
};

type RpcResponse<TResult = any, TError = any> = {
  jsonrpc: `${number}`;
  id: number;
} & (
  | SuccessResult<TResult>
  | ErrorResult<TError>
  | Subscription<TResult, TError>
);

/**
 * @internal
 */
export async function fetchRpc(
  rpcUrl: string,
  client: ThirdwebClient,
  options: FetchRpcOptions,
): Promise<RpcResponse[]> {
  const response = await getClientFetch(client)(rpcUrl, {
    headers: {
      ...client.config?.rpc?.fetch?.headers,
      "Content-Type": "application/json",
    },
    body: stringify(options.requests),
    method: "POST",
    requestTimeoutMs:
      options.requestTimeoutMs ?? client.config?.rpc?.fetch?.requestTimeoutMs,
    keepalive: client.config?.rpc?.fetch?.keepalive,
  });

  if (!response.ok) {
    response.body?.cancel();
    throw new Error(
      `RPC request failed with status ${response.status} - ${response.statusText}`,
    );
  }

  let result;

  if (response.headers.get("Content-Type")?.startsWith("application/json")) {
    result = await response.json();
  } else {
    result = await response.text();
  }

  return result;
}

type FetchSingleRpcOptions = {
  request: RpcRequest;
  requestTimeoutMs?: number;
};

/**
 * @internal
 */
export async function fetchSingleRpc(
  rpcUrl: string,
  client: ThirdwebClient,
  options: FetchSingleRpcOptions,
): Promise<RpcResponse> {
  const response = await getClientFetch(client)(rpcUrl, {
    headers: {
      ...(client.config?.rpc?.fetch?.headers || {}),
      "Content-Type": "application/json",
    },
    body: stringify(options.request),
    method: "POST",
    requestTimeoutMs:
      options.requestTimeoutMs ?? client.config?.rpc?.fetch?.requestTimeoutMs,
    keepalive: client.config?.rpc?.fetch?.keepalive,
  });

  if (!response.ok) {
    response.body?.cancel();
    throw new Error(`RPC request failed with status ${response.status}`);
  }

  let result;

  if (response.headers.get("Content-Type")?.startsWith("application/json")) {
    result = await response.json();
  } else {
    result = await response.text();
  }

  return result;
}

import type { ThirdwebContract } from "../contract/index.js";
import type { MethodType } from "../abi/resolveAbiFunction.js";
import type { ThirdwebClient } from "../client/client.js";
import type { Transaction, TransactionOptions } from "./types.js";

export function createTx<
  client extends ThirdwebClient,
  method extends MethodType,
>(client: client, options: TransactionOptions<client, method>) {
  const contract: ThirdwebContract = {
    ...client,
    ...options,
  };

  return {
    contract,
    options,
    _abiFn: null,
    _params: null,
    _encoded: null,
  } as Transaction<typeof contract, method>;
}

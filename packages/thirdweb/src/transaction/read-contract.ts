import type { MethodType } from "../abi/resolveAbiFunction.js";
import type { ThirdwebClient } from "../client/client.js";
import type { TransactionOptions } from "./types.js";

export async function readContract<
  client extends ThirdwebClient,
  method extends MethodType,
>(client: client, options: TransactionOptions<client, method>) {
  console.log(client, options);
}

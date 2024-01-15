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

// // setup the abi fn resolver
// const resolveAbiFn = memoizePromise(async () => {
//   const { resolveAbiFunction } = await import("../abi/resolveAbiFunction.js");
//   return await resolveAbiFunction(contract, options);
// });
// // setup the params resolver
// const resolveParams = memoizePromise(async () => {
//   const params =
//     typeof options.params === "function"
//       ? await options.params()
//       : options.params;
//   return params;
// });
// return {
//   encode: memoizePromise(async () => {
//     const [{ encodeAbiFunction }, parsedAbiFn, resolvedParams] =
//       await Promise.all([
//         import("../abi/encode.js"),
//         resolveAbiFn(),
//         resolveParams(),
//       ]);
//     return encodeAbiFunction(parsedAbiFn, resolvedParams);
//   }),
// };

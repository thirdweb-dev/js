import type {
  AbiConstructor,
  AbiParameter,
  AbiParametersToPrimitiveTypes,
} from "abitype";
import { concatHex, encodeAbiParameters, type Hex } from "viem";
import type { SharedDeployOptions } from "./types.js";
import type { Prettify } from "../../utils/type-utils.js";
import { prepareTransaction } from "../../transaction/prepare-transaction.js";

export type PrepareDirectDeployTransactionOptions<
  TConstructor extends AbiConstructor,
  TParams = AbiParametersToPrimitiveTypes<TConstructor["inputs"]>,
> = Prettify<
  Pick<SharedDeployOptions, "chain" | "client"> & {
    constructorAbi: TConstructor;
    bytecode: Hex;
    constructorParams: TParams extends readonly AbiParameter[]
      ? TParams
      : readonly unknown[];
  }
>;

/**
 * Prepares a direct deploy transaction with ABI.
 * @template TConstructor - The type of the ABI constructor.
 * @param options - The options for preparing the transaction.
 * @returns - The prepared transaction.
 * @example
 * ```ts
 * import { prepareDirectDeployTransaction } from "thirdweb/contract";
 * import { ethereum } from "thirdweb/chains";
 * const tx = prepareDirectDeployTransaction({
 *  client,
 *  chain: ethereum,
 *  bytecode: "0x...",
 *  constructorAbi: {
 *    inputs: [{ type: "uint256", name: "value" }],
 *    type: "constructor",
 *  },
 *  constructorParams: [123],
 * });
 * ```
 */
export function prepareDirectDeployTransaction<
  const TConstructor extends AbiConstructor,
>(options: PrepareDirectDeployTransactionOptions<TConstructor>) {
  // prepare the tx
  return prepareTransaction({
    chain: options.chain,
    client: options.client,
    // the data is the bytecode and the constructor parameters
    data: concatHex([
      options.bytecode,
      encodeAbiParameters(
        options.constructorAbi.inputs,
        options.constructorParams,
      ),
    ]),
  });
}

import type {
  AbiConstructor,
  AbiParameter,
  AbiParametersToPrimitiveTypes,
} from "abitype";
import { concatHex } from "viem";
import type { Prettify } from "../../utils/type-utils.js";
import { prepareTransaction } from "../../transaction/prepare-transaction.js";
import { encodeAbiParameters } from "../../utils/abi/encodeAbiParameters.js";
import { isHex, type Hex } from "../../utils/encoding/hex.js";
import { ensureBytecodePrefix } from "../../utils/bytecode/prefix.js";
import type { ClientAndChain } from "../../utils/types.js";

export type PrepareDirectDeployTransactionOptions<
  TConstructor extends AbiConstructor,
  TParams = AbiParametersToPrimitiveTypes<TConstructor["inputs"]>,
> = Prettify<
  ClientAndChain & {
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
 * @extension DEPLOY
 */
export function prepareDirectDeployTransaction<
  const TConstructor extends AbiConstructor,
>(options: PrepareDirectDeployTransactionOptions<TConstructor>) {
  const bytecode = ensureBytecodePrefix(options.bytecode);
  if (!isHex(bytecode)) {
    throw new Error(`Contract bytecode is invalid.\n\n${bytecode}`);
  }
  // prepare the tx
  return prepareTransaction({
    chain: options.chain,
    client: options.client,
    // the data is the bytecode and the constructor parameters
    data: concatHex([
      bytecode,
      encodeAbiParameters(
        options.constructorAbi.inputs,
        options.constructorParams,
      ),
    ]),
  });
}

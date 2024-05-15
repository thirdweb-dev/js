import type {
  AbiConstructor,
  AbiParameter,
  AbiParametersToPrimitiveTypes,
} from "abitype";
import { sendAndConfirmTransaction } from "../../transaction/actions/send-and-confirm-transaction.js";
import { prepareTransaction } from "../../transaction/prepare-transaction.js";
import { encodeAbiParameters } from "../../utils/abi/encodeAbiParameters.js";
import { ensureBytecodePrefix } from "../../utils/bytecode/prefix.js";
import { concatHex } from "../../utils/encoding/helpers/concat-hex.js";
import { type Hex, isHex } from "../../utils/encoding/hex.js";
import type { Prettify } from "../../utils/type-utils.js";
import type { ClientAndChain } from "../../utils/types.js";
import type { Account } from "../../wallets/interfaces/wallet.js";

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
 * import { prepareDirectDeployTransaction } from "thirdweb/deploys";
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
        options.constructorAbi.inputs ?? [], // Leave an empty array if there's no constructor
        options.constructorParams,
      ),
    ]),
  });
}

/**
 * Deploy a contract on a given chain
 * @param options - the deploy options
 * @returns - a promise that resolves to the deployed contract address
 * @example
 * ```ts
 * import { deployContract } from "thirdweb/deployContract";
 *
 * const address = await deployContract({
 *  client,
 *  chain,
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
export async function deployContract<const TConstructor extends AbiConstructor>(
  options: PrepareDirectDeployTransactionOptions<TConstructor> & {
    account: Account;
  },
) {
  const deployTx = prepareDirectDeployTransaction(options);
  const receipt = await sendAndConfirmTransaction({
    account: options.account,
    transaction: deployTx,
  });
  if (!receipt.contractAddress) {
    throw new Error(
      `Could not find deployed contract address in transaction: ${receipt.transactionHash}`,
    );
  }
  return receipt.contractAddress;
}

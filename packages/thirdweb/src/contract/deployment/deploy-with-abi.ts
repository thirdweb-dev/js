import type { Abi, AbiConstructor } from "abitype";
import { sendAndConfirmTransaction } from "../../transaction/actions/send-and-confirm-transaction.js";
import { prepareTransaction } from "../../transaction/prepare-transaction.js";
import { encodeAbiParameters } from "../../utils/abi/encodeAbiParameters.js";
import { normalizeFunctionParams } from "../../utils/abi/normalizeFunctionParams.js";
import { computeDeploymentAddress } from "../../utils/any-evm/compute-deployment-address.js";
import { computeDeploymentInfoFromBytecode } from "../../utils/any-evm/compute-published-contract-deploy-info.js";
import { ensureBytecodePrefix } from "../../utils/bytecode/prefix.js";
import { concatHex } from "../../utils/encoding/helpers/concat-hex.js";
import { type Hex, isHex } from "../../utils/encoding/hex.js";
import type { Prettify } from "../../utils/type-utils.js";
import type { ClientAndChain } from "../../utils/types.js";
import type { Account } from "../../wallets/interfaces/wallet.js";

/**
 * @extension DEPLOY
 */
export type PrepareDirectDeployTransactionOptions = Prettify<
  ClientAndChain & {
    abi: Abi;
    bytecode: Hex;
    constructorParams?: Record<string, unknown>;
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
export function prepareDirectDeployTransaction(
  options: PrepareDirectDeployTransactionOptions,
) {
  const bytecode = ensureBytecodePrefix(options.bytecode);
  if (!isHex(bytecode)) {
    throw new Error(`Contract bytecode is invalid.\n\n${bytecode}`);
  }
  const constructorAbi = options.abi.find(
    (abi) => abi.type === "constructor",
  ) as AbiConstructor | undefined;
  // prepare the tx
  return prepareTransaction({
    chain: options.chain,
    client: options.client,
    // the data is the bytecode and the constructor parameters
    data: concatHex([
      bytecode,
      encodeAbiParameters(
        constructorAbi?.inputs || [], // Leave an empty array if there's no constructor
        normalizeFunctionParams(constructorAbi, options.constructorParams),
      ),
    ]),
  });
}

/**
 * Deploy a contract on a given chain
 * @param options - the deploy options
 * @returns - a promise that resolves to the deployed contract address
 * @example
 *
 * ## Deploying a regular contract from ABI and bytecode
 *
 * ```ts
 * import { deployContract } from "thirdweb/deployContract";
 *
 * const address = await deployContract({
 *  client,
 *  chain,
 *  bytecode: "0x...",
 *  abi: contractAbi,
 *  constructorParams: {
 *    param1: "value1",
 *    param2: 123,
 *  },
 *  salt, // optional: salt enables deterministic deploys
 * });
 * ```
 *
 * ## Deploying a contract deterministically
 *
 * ```ts
 * import { deployContract } from "thirdweb/deployContract";
 *
 * const address = await deployContract({
 *  client,
 *  chain,
 *  bytecode: "0x...",
 *  abi: contractAbi,
 *  constructorParams: {
 *    param1: "value1",
 *    param2: 123,
 *  },
 *  salt, // passing a salt will enable deterministic deploys
 * });
 * ```
 * @extension DEPLOY
 */
export async function deployContract(
  options: PrepareDirectDeployTransactionOptions & {
    account: Account;
    salt?: string;
  },
) {
  if (options.salt !== undefined) {
    // Deploy with CREATE2 if salt is provided
    const info = await computeDeploymentInfoFromBytecode(options);
    sendAndConfirmTransaction({
      account: options.account,
      transaction: prepareTransaction({
        chain: options.chain,
        client: options.client,
        to: info.create2FactoryAddress,
        data: info.initBytecodeWithsalt,
      }),
    });
    return computeDeploymentAddress({
      bytecode: options.bytecode,
      encodedArgs: info.encodedArgs,
      create2FactoryAddress: info.create2FactoryAddress,
    });
  }

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

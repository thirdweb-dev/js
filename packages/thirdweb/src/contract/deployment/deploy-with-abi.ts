import type { Abi, AbiConstructor } from "abitype";
import { parseEventLogs } from "../../event/actions/parse-logs.js";
import { contractDeployedEvent } from "../../extensions/stylus/__generated__/IStylusDeployer/events/ContractDeployed.js";
import { activateStylusContract } from "../../extensions/stylus/write/activateStylusContract.js";
import { deployWithStylusConstructor } from "../../extensions/stylus/write/deployWithStylusConstructor.js";
import { isContractActivated } from "../../extensions/stylus/write/isContractActivated.js";
import { sendAndConfirmTransaction } from "../../transaction/actions/send-and-confirm-transaction.js";
import { sendTransaction } from "../../transaction/actions/send-transaction.js";
import { prepareTransaction } from "../../transaction/prepare-transaction.js";
import { encodeAbiParameters } from "../../utils/abi/encodeAbiParameters.js";
import { normalizeFunctionParams } from "../../utils/abi/normalizeFunctionParams.js";
import { computeDeploymentAddress } from "../../utils/any-evm/compute-deployment-address.js";
import { computeDeploymentInfoFromBytecode } from "../../utils/any-evm/compute-published-contract-deploy-info.js";
import { isZkSyncChain } from "../../utils/any-evm/zksync/isZkSyncChain.js";
import { isContractDeployed } from "../../utils/bytecode/is-contract-deployed.js";
import { ensureBytecodePrefix } from "../../utils/bytecode/prefix.js";
import { concatHex } from "../../utils/encoding/helpers/concat-hex.js";
import { type Hex, isHex } from "../../utils/encoding/hex.js";
import type { Prettify } from "../../utils/type-utils.js";
import type { ClientAndChain } from "../../utils/types.js";
import type { Account } from "../../wallets/interfaces/wallet.js";
import { getContract } from "../contract.js";
import { zkDeployContract } from "./zksync/zkDeployContract.js";

/**
 * @extension DEPLOY
 */
export type PrepareDirectDeployTransactionOptions = Prettify<
  ClientAndChain & {
    abi: Abi;
    bytecode: Hex;
    constructorParams?: Record<string, unknown>;
    extraDataWithUri?: string;
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
      (options.extraDataWithUri as `0x${string}`) || "0x",
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
 * import { deployContract } from "thirdweb/deploys";
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
 * import { deployContract } from "thirdweb/deploys";
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
    extraDataWithUri?: Hex;
    isStylus?: boolean;
  },
) {
  if (await isZkSyncChain(options.chain)) {
    return zkDeployContract({
      abi: options.abi,
      account: options.account,
      bytecode: options.bytecode,
      chain: options.chain,
      client: options.client,
      params: options.constructorParams,
      salt: options.salt,
    });
  }

  let address: string | null | undefined;
  if (options.salt !== undefined) {
    // Deploy with CREATE2 if salt is provided
    const info = await computeDeploymentInfoFromBytecode(options);
    address = computeDeploymentAddress({
      bytecode: options.bytecode,
      create2FactoryAddress: info.create2FactoryAddress,
      encodedArgs: info.encodedArgs,
      extraDataWithUri: options.extraDataWithUri,
      salt: options.salt,
    });
    const isDeployed = await isContractDeployed(
      getContract({
        address,
        chain: options.chain,
        client: options.client,
      }),
    );
    if (isDeployed) {
      return address;
    }
    await sendAndConfirmTransaction({
      account: options.account,
      transaction: prepareTransaction({
        chain: options.chain,
        client: options.client,
        data: info.initCalldata,
        to: info.create2FactoryAddress,
      }),
    });
  } else if (options.isStylus && options.constructorParams) {
    const isActivated = await isContractActivated(options);

    if (!isActivated) {
      // one time deploy to activate the new codehash
      const impl = await deployContract({
        ...options,
        abi: [],
        constructorParams: undefined,
      });

      // fetch metadata
      await fetch(
        `https://contract.thirdweb.com/metadata/${options.chain.id}/${impl}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "GET",
        },
      );
    }

    const deployTx = deployWithStylusConstructor({
      abi: options.abi,
      bytecode: options.bytecode,
      chain: options.chain,
      client: options.client,
      constructorParams: options.constructorParams,
    });

    const receipt = await sendAndConfirmTransaction({
      account: options.account,
      transaction: deployTx,
    });

    const deployEvent = contractDeployedEvent();
    const decodedEvent = parseEventLogs({
      events: [deployEvent],
      logs: receipt.logs,
    });
    if (decodedEvent.length === 0 || !decodedEvent[0]) {
      throw new Error(
        `No ContractDeployed event found in transaction: ${receipt.transactionHash}`,
      );
    }
    address = decodedEvent[0]?.args.deployedContract;
  } else {
    const deployTx = prepareDirectDeployTransaction(options);
    const receipt = await sendAndConfirmTransaction({
      account: options.account,
      transaction: deployTx,
    });
    address = receipt.contractAddress;
    if (!address) {
      throw new Error(
        `Could not find deployed contract address in transaction: ${receipt.transactionHash}`,
      );
    }
  }

  if (options.isStylus) {
    try {
      const activationTransaction = await activateStylusContract({
        chain: options.chain,
        client: options.client,
        contractAddress: address,
      });

      await sendTransaction({
        account: options.account,
        transaction: activationTransaction,
      });
    } catch {
      console.error("Error: Contract could not be activated.");
    }
  }

  return address;
}

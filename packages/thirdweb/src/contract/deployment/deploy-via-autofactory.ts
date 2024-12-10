import { parseEventLogs } from "../../event/actions/parse-logs.js";
import { proxyDeployedEvent } from "../../extensions/thirdweb/__generated__/IContractFactory/events/ProxyDeployed.js";
import { deployProxyByImplementation } from "../../extensions/thirdweb/__generated__/IContractFactory/write/deployProxyByImplementation.js";
import { eth_blockNumber } from "../../rpc/actions/eth_blockNumber.js";
import { getRpcClient } from "../../rpc/rpc.js";
import { encode } from "../../transaction/actions/encode.js";
import { sendAndConfirmTransaction } from "../../transaction/actions/send-and-confirm-transaction.js";
import type { PreparedTransaction } from "../../transaction/prepare-transaction.js";
import { keccakId } from "../../utils/any-evm/keccak-id.js";
import { isZkSyncChain } from "../../utils/any-evm/zksync/isZkSyncChain.js";
import { toHex } from "../../utils/encoding/hex.js";
import { resolvePromisedValue } from "../../utils/promise/resolve-promised-value.js";
import type {
  ClientAndChain,
  ClientAndChainAndAccount,
} from "../../utils/types.js";
import type { ThirdwebContract } from "../contract.js";
import { zkDeployProxy } from "./zksync/zkDeployProxy.js";

/**
 * @internal
 */
export function prepareAutoFactoryDeployTransaction(
  args: ClientAndChain & {
    cloneFactoryContract: ThirdwebContract;
    initializeTransaction: PreparedTransaction;
    salt?: string;
  },
) {
  return deployProxyByImplementation({
    contract: args.cloneFactoryContract,
    async asyncParams() {
      const rpcRequest = getRpcClient({
        ...args,
      });
      const blockNumber = await eth_blockNumber(rpcRequest);
      const salt = args.salt
        ? args.salt.startsWith("0x") && args.salt.length === 66
          ? (args.salt as `0x${string}`)
          : keccakId(args.salt)
        : toHex(blockNumber, {
            size: 32,
          });
      const implementation = await resolvePromisedValue(
        args.initializeTransaction.to,
      );
      if (!implementation) {
        throw new Error("initializeTransaction must have a 'to' field set");
      }
      return {
        data: await encode(args.initializeTransaction),
        implementation,
        salt,
      } as const;
    },
  });
}

/**
 * @internal
 */
export async function deployViaAutoFactory(
  options: ClientAndChainAndAccount & {
    cloneFactoryContract: ThirdwebContract;
    initializeTransaction: PreparedTransaction;
    salt?: string;
  },
): Promise<string> {
  const {
    chain,
    client,
    account,
    cloneFactoryContract,
    initializeTransaction,
    salt,
  } = options;

  if (await isZkSyncChain(chain)) {
    return zkDeployProxy({
      chain,
      client,
      account,
      cloneFactoryContract,
      initializeTransaction,
      salt,
    });
  }

  const tx = prepareAutoFactoryDeployTransaction({
    chain,
    client,
    cloneFactoryContract,
    initializeTransaction,
    salt,
  });
  const receipt = await sendAndConfirmTransaction({
    transaction: tx,
    account,
  });
  const decodedEvent = parseEventLogs({
    events: [proxyDeployedEvent()],
    logs: receipt.logs,
  });
  if (decodedEvent.length === 0 || !decodedEvent[0]) {
    throw new Error(
      `No ProxyDeployed event found in transaction: ${receipt.transactionHash}`,
    );
  }
  return decodedEvent[0]?.args.proxy;
}

/**
 * @internal
 */
export async function deployViaAutoFactoryWithImplementationParams(
  options: ClientAndChainAndAccount & {
    cloneFactoryContract: ThirdwebContract;
    initializeData?: `0x${string}`;
    implementationAddress: string;
    salt?: string;
  },
): Promise<string> {
  const {
    client,
    chain,
    account,
    cloneFactoryContract,
    initializeData,
    implementationAddress,
    salt,
  } = options;

  const rpcRequest = getRpcClient({
    client,
    chain,
  });
  const blockNumber = await eth_blockNumber(rpcRequest);
  const parsedSalt = salt
    ? salt.startsWith("0x") && salt.length === 66
      ? (salt as `0x${string}`)
      : keccakId(salt)
    : toHex(blockNumber, {
        size: 32,
      });

  const asd = {
    contract: cloneFactoryContract,
    data: initializeData || "0x",
    implementation: implementationAddress,
    salt: parsedSalt,
  };
  const tx = deployProxyByImplementation(asd);
  const receipt = await sendAndConfirmTransaction({
    transaction: tx,
    account,
  });
  const decodedEvent = parseEventLogs({
    events: [proxyDeployedEvent()],
    logs: receipt.logs,
  });
  if (decodedEvent.length === 0 || !decodedEvent[0]) {
    throw new Error(
      `No ProxyDeployed event found in transaction: ${receipt.transactionHash}`,
    );
  }
  return decodedEvent[0]?.args.proxy;
}

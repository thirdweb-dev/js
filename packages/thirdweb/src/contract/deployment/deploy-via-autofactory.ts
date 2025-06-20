import { parseEventLogs } from "../../event/actions/parse-logs.js";
import { proxyDeployedV2Event } from "../../extensions/thirdweb/__generated__/IContractFactory/events/ProxyDeployedV2.js";
import { deployProxyByImplementationV2 } from "../../extensions/thirdweb/__generated__/IContractFactory/write/deployProxyByImplementationV2.js";
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
    initializeTransaction?: PreparedTransaction;
    initializeData?: `0x${string}`;
    implementationAddress?: string;
    isCrosschain?: boolean;
    salt?: string;
  },
) {
  return deployProxyByImplementationV2({
    async asyncParams() {
      const rpcRequest = getRpcClient({
        ...args,
      });
      const blockNumber = await eth_blockNumber(rpcRequest);
      const salt = args.salt
        ? args.salt.startsWith("0x") && args.salt.length === 66
          ? (args.salt as `0x${string}`)
          : keccakId(args.salt)
        : (`0x03${toHex(blockNumber, {
            size: 31,
          }).replace(/^0x/, "")}` as `0x${string}`);

      if (args.isCrosschain) {
        if (!args.initializeData || !args.implementationAddress) {
          throw new Error(
            "initializeData or implementationAddress can't be undefined",
          );
        }

        return {
          data: args.initializeData,
          extraData: "0x",
          implementation: args.implementationAddress,
          salt,
        } as const;
      }

      if (!args.initializeTransaction) {
        throw new Error("initializeTransaction can't be undefined");
      }

      const implementation = await resolvePromisedValue(
        args.initializeTransaction.to,
      );
      if (!implementation) {
        throw new Error("initializeTransaction must have a 'to' field set");
      }
      return {
        data: await encode(args.initializeTransaction),
        extraData: "0x",
        implementation,
        salt,
      } as const;
    },
    contract: args.cloneFactoryContract,
  });
}

/**
 * @internal
 */
export async function deployViaAutoFactory(
  options: ClientAndChainAndAccount & {
    cloneFactoryContract: ThirdwebContract;
    initializeTransaction?: PreparedTransaction;
    initializeData?: `0x${string}`;
    implementationAddress?: string;
    isCrosschain?: boolean;
    salt?: string;
  },
): Promise<string> {
  const {
    chain,
    client,
    account,
    cloneFactoryContract,
    initializeTransaction,
    initializeData,
    implementationAddress,
    isCrosschain,
    salt,
  } = options;

  if (await isZkSyncChain(chain)) {
    if (!initializeTransaction) {
      throw new Error("initializeTransaction can't be undefined");
    }
    return zkDeployProxy({
      account,
      chain,
      client,
      cloneFactoryContract,
      initializeTransaction,
      salt,
    });
  }

  const tx = prepareAutoFactoryDeployTransaction({
    chain,
    client,
    cloneFactoryContract,
    implementationAddress,
    initializeData,
    initializeTransaction,
    isCrosschain,
    salt,
  });
  const receipt = await sendAndConfirmTransaction({
    account,
    transaction: tx,
  });

  const proxyEvent = proxyDeployedV2Event();
  const decodedEvent = parseEventLogs({
    events: [proxyEvent],
    logs: receipt.logs,
  });
  if (decodedEvent.length === 0 || !decodedEvent[0]) {
    throw new Error(
      `No ProxyDeployed event found in transaction: ${receipt.transactionHash}`,
    );
  }
  return decodedEvent[0]?.args.proxy;
}

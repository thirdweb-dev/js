import { parseEventLogs } from "../../event/actions/parse-logs.js";
import { proxyDeployedEvent } from "../../extensions/thirdweb/__generated__/IContractFactory/events/ProxyDeployed.js";
import { deployProxyByImplementation } from "../../extensions/thirdweb/__generated__/IContractFactory/write/deployProxyByImplementation.js";
import { eth_blockNumber } from "../../rpc/actions/eth_blockNumber.js";
import { getRpcClient } from "../../rpc/rpc.js";
import { encode } from "../../transaction/actions/encode.js";
import { sendAndConfirmTransaction } from "../../transaction/actions/send-and-confirm-transaction.js";
import type { PreparedTransaction } from "../../transaction/prepare-transaction.js";
import { keccakId } from "../../utils/any-evm/keccak-id.js";
import { toHex } from "../../utils/encoding/hex.js";
import { resolvePromisedValue } from "../../utils/promise/resolve-promised-value.js";
import type {
  ClientAndChain,
  ClientAndChainAndAccount,
} from "../../utils/types.js";
import type { ThirdwebContract } from "../contract.js";

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
        ? keccakId(args.salt)
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
  } = options;
  const tx = prepareAutoFactoryDeployTransaction({
    chain,
    client,
    cloneFactoryContract,
    initializeTransaction,
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

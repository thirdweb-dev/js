import { eth_blockNumber } from "../../rpc/actions/eth_blockNumber.js";
import { getRpcClient } from "../../rpc/rpc.js";
import { keccakId } from "../../utils/any-evm/keccak-id.js";
import { toHex } from "../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../contract.js";
import { deployProxyByImplementation } from "../../extensions/thirdweb/__generated__/IContractFactory/write/deployProxyByImplementation.js";
import type { ClientAndChain } from "../../utils/types.js";
import type { PreparedTransaction } from "../../transaction/prepare-transaction.js";
import { encode } from "../../transaction/actions/encode.js";
import { resolvePromisedValue } from "../../utils/promise/resolve-promised-value.js";

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

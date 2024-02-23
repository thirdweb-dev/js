import type { Abi } from "abitype";
import type { SharedDeployOptions } from "./types.js";
import { getContract } from "../contract.js";
import { prepareContractCall } from "../../transaction/prepare-contract-call.js";
import { encode } from "../../transaction/actions/encode.js";
import { keccakId } from "../../utils/any-evm/keccak-id.js";
import { getRpcClient } from "../../rpc/rpc.js";
import { eth_blockNumber } from "../../rpc/actions/eth_blockNumber.js";
import { toHex } from "../../utils/encoding/hex.js";

/**
 * Prepares a deploy transaction via a proxy factory.
 * @param args - The arguments for deploying the contract.
 * @example
 * ```ts
 * import { prepareDeployTransactionViaCloneFactory } from "thirdweb/contract";
 * import { ethereum } from "thirdweb/chains";
 *
 * const tx = await prepareDeployTransactionViaCloneFactory({
 *   client,
 *   chain: ethereum,
 *   factoryAddress: "0x...",
 *   implementationAddress: "0x...",
 *   implementationAbi: abi,
 *   initializerFunction: "initialize",
 *   initializerArgs: [123, "hello"],
 * });
 * ```
 * @returns A prepared deployment transaction ready to be sent.
 */
export async function prepareDeployTransactionViaCloneFactory(
  args: SharedDeployOptions & {
    factoryAddress: string;
    implementationAddress: string;
    implementationAbi: Abi;
    initializerFunction: string;
    initializerArgs: unknown[];
    saltForProxyDeploy?: string;
  },
) {
  const {
    client,
    chain,
    factoryAddress,
    implementationAddress,
    implementationAbi,
    initializerFunction,
    initializerArgs,
    saltForProxyDeploy,
  } = args;
  const factory = getContract({
    client,
    chain,
    address: factoryAddress,
  });
  return prepareContractCall({
    contract: factory,
    method:
      "function deployProxyByImplementation(address, bytes, bytes32) returns (address)",
    params: async () => {
      const implementation = getContract({
        client,
        chain,
        address: implementationAddress,
        abi: implementationAbi,
      });
      const initializerTransaction = prepareContractCall({
        contract: implementation,
        method: initializerFunction,
        params: initializerArgs,
      });
      const rpcRequest = getRpcClient({
        client,
        chain,
      });
      const blockNumber = await eth_blockNumber(rpcRequest);
      const salt = saltForProxyDeploy
        ? keccakId(saltForProxyDeploy)
        : toHex(blockNumber, {
            size: 32,
          });
      const encoded = await encode(initializerTransaction);
      return [implementationAddress, encoded, salt] as const;
    },
  });
}

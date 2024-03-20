import type { SharedDeployOptions } from "./types.js";
import type { FetchDeployMetadataResult } from "../../utils/any-evm/deploy-metadata.js";
import { encodeFunctionData } from "viem";
import { eth_blockNumber } from "../../rpc/actions/eth_blockNumber.js";
import { getRpcClient } from "../../rpc/rpc.js";
import { keccakId } from "../../utils/any-evm/keccak-id.js";
import { toHex } from "../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../contract.js";
import { deployProxyByImplementation } from "../../extensions/thirdweb/__generated__/IContractFactory/write/deployProxyByImplementation.js";
import { getDeployedImplementationContract } from "./utils/implementations.js";

/**
 * @internal
 */
export function prepareAutoFactoryDeployTransaction(
  args: SharedDeployOptions & {
    cloneFactoryContract: ThirdwebContract;
    initializerArgs: unknown[];
    contractMetadata: FetchDeployMetadataResult;
    salt?: string;
  },
) {
  const { compilerMetadata, extendedMetadata } = args.contractMetadata;

  return deployProxyByImplementation({
    contract: args.cloneFactoryContract,
    async asyncParams() {
      // check if the implementation is deployed
      const implementationContract = await getDeployedImplementationContract({
        chain: args.chain,
        client: args.client,
        contractId: args.contractMetadata.compilerMetadata.name,
        constructorParams: [], // TODO either infer this, or pass it in
      });

      if (!implementationContract) {
        throw new Error(
          `Implementation not deployed for ${args.contractMetadata.compilerMetadata.name}. Please deploy it first.`,
        );
      }

      const initializerFunction =
        extendedMetadata?.factoryDeploymentData
          ?.implementationInitializerFunction;

      const encodedInitializer = encodeFunctionData({
        abi: compilerMetadata.abi,
        functionName: initializerFunction,
        args: args.initializerArgs,
      });

      const rpcRequest = getRpcClient({
        ...args,
      });
      const blockNumber = await eth_blockNumber(rpcRequest);
      const salt = args.salt
        ? keccakId(args.salt)
        : toHex(blockNumber, {
            size: 32,
          });
      return {
        data: encodedInitializer,
        implementation: implementationContract.address,
        salt,
      } as const;
    },
  });
}

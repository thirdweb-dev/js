import type { SharedDeployOptions } from "./types.js";
import type { FetchDeployMetadataResult } from "../../utils/any-evm/deploy-metadata.js";
import { isContractDeployed } from "../../utils/bytecode/is-contract-deployed.js";
import { encodeFunctionData } from "viem";
import { eth_blockNumber } from "../../rpc/actions/eth_blockNumber.js";
import { getRpcClient } from "../../rpc/rpc.js";
import { keccakId } from "../../utils/any-evm/keccak-id.js";
import { toHex } from "../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../contract.js";
import { deployProxyByImplementation } from "../../extensions/thirdweb/__generated__/IContractFactory/write/deployProxyByImplementation.js";
import { computeContractAddress } from "../../utils/any-evm/compute-published-contract-address.js";

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
      const implementationAddress = await computeContractAddress({
        ...args,
        contractMetadata: args.contractMetadata,
        constructorParams: [], // TODO guess this from the constructor abi
      });
      const isImplementationDeployed = await isContractDeployed({
        ...args,
        address: implementationAddress,
      });
      if (!isImplementationDeployed) {
        throw new Error(
          `Implementation not deployed for ${args.contractMetadata.compilerMetadata.name} at ${implementationAddress}. Please deploy it first.`,
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
        implementation: implementationAddress,
        salt,
      } as const;
    },
  });
}

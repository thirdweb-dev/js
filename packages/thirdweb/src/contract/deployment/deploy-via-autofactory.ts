import type { SharedDeployOptions } from "./types.js";
import type { FetchDeployMetadataResult } from "../../utils/any-evm/deploy-metadata.js";
import { getDeployedInfraContract } from "./utils/infra.js";
import { computeAddressFromMetadata } from "../../utils/any-evm/compute-published-contract-address.js";
import { isContractDeployed } from "../../utils/bytecode/is-contract-deployed.js";
import { deployProxyByImplementation } from "../../extensions/thirdweb/__generated__/IContractFactory/write/deployProxyByImplementation.js";
import { encodeFunctionData } from "viem";
import { eth_blockNumber } from "../../rpc/actions/eth_blockNumber.js";
import { getRpcClient } from "../../rpc/rpc.js";
import { keccakId } from "../../utils/any-evm/keccak-id.js";
import { toHex } from "../../utils/encoding/hex.js";

/**
 * @internal
 */
export async function prepareDeployTransactionViaAutoFactory(
  args: SharedDeployOptions & {
    initializerArgs: unknown[];
    metadata: FetchDeployMetadataResult;
    salt?: string;
  },
) {
  const { compilerMetadata, extendedMetadata } = args.metadata;

  // check if Forwarder is deployed
  const forwarder = await getDeployedInfraContract({
    ...args,
    contractId: "Forwarder",
    constructorParams: [],
  });
  if (!forwarder) {
    // TODO push the deployment of the forwarder as one more tx
    throw new Error("Forwarder not deployed");
  }

  // check if clone factory is deployed
  const cloneFactory = await getDeployedInfraContract({
    ...args,
    contractId: "TWCloneFactory",
    constructorParams: [forwarder.address],
  });
  if (!cloneFactory) {
    // TODO push the deployment of the clone factory as one more tx
    throw new Error("TWCloneFactory not deployed");
  }

  // TODO extract this
  // check if the implementation is deployed
  const implementationAddress = await computeAddressFromMetadata({
    ...args,
    compilerMetadata,
    constructorParams: [], // TODO guess this from the constructor abi
  });
  const isImplementationDeployed = await isContractDeployed({
    ...args,
    address: implementationAddress,
  });
  if (!isImplementationDeployed) {
    // TODO push the deployment of the implementation as one more tx
    throw new Error("Implementation not deployed");
  }

  const initializerFunction =
    extendedMetadata?.factoryDeploymentData?.implementationInitializerFunction;

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
  console.log(blockNumber);

  return deployProxyByImplementation({
    ...args,
    contract: cloneFactory,
    data: encodedInitializer,
    implementation: implementationAddress,
    salt,
  });
}

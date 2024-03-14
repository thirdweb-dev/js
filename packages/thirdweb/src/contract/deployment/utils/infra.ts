import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { isContractDeployed } from "../../../utils/bytecode/is-contract-deployed.js";
import { getContract, type ThirdwebContract } from "../../contract.js";
import { computeDeploymentInfoFromContractId } from "../../../utils/any-evm/compute-published-contract-deploy-info.js";
import { prepareTransaction } from "../../../transaction/prepare-transaction.js";
import { computeAddressFromContractId } from "../../../utils/any-evm/compute-published-contract-address.js";

export type InfraContractId =
  | "WETH9"
  | "Forwarder"
  | "ForwarderEOAOnly"
  | "TWCloneFactory";

export type GetDeployedInfraParams = {
  client: ThirdwebClient;
  chain: Chain;
  contractId: InfraContractId;
  constructorParams: unknown[];
};

/**
 * @internal
 */
export async function getDeployedInfraContract(
  options: GetDeployedInfraParams,
): Promise<ThirdwebContract | null> {
  const address = await computeAddressFromContractId({
    ...options,
  });
  const factory = getContract({
    ...options,
    address,
  });
  if (await isContractDeployed(factory)) {
    return factory;
  } else {
    return null;
  }
}

/**
 * @internal
 */
export async function prepareInfraContractDeployTransaction(
  options: GetDeployedInfraParams,
) {
  const cloneFactoryInfo = await computeDeploymentInfoFromContractId({
    ...options,
  });
  return prepareTransaction({
    ...options,
    to: cloneFactoryInfo.create2FactoryAddress,
    data: cloneFactoryInfo.initBytecodeWithsalt,
  });
}

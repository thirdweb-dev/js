import { isContractDeployed } from "../../../utils/bytecode/is-contract-deployed.js";
import { getContract, type ThirdwebContract } from "../../contract.js";
import { prepareTransaction } from "../../../transaction/prepare-transaction.js";
import type { ClientAndChain } from "../../../utils/types.js";
import type { Prettify } from "../../../utils/type-utils.js";
import { computePublishedContractAddress } from "../../../utils/any-evm/compute-published-contract-address.js";
import { computeDeploymentInfoFromContractId } from "../../../utils/any-evm/compute-published-contract-deploy-info.js";

export type InfraContractId =
  | "WETH9"
  | "Forwarder"
  | "ForwarderEOAOnly"
  | "TWCloneFactory";

export type GetDeployedInfraParams = Prettify<
  ClientAndChain & {
    contractId: InfraContractId;
    constructorParams: unknown[];
  }
>;

/**
 * @internal
 */
export async function getDeployedInfraContract(
  options: GetDeployedInfraParams,
): Promise<ThirdwebContract | null> {
  const address = await computePublishedContractAddress({
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

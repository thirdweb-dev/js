import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { isContractDeployed } from "../../../utils/bytecode/is-contract-deployed.js";
import { getContract, type ThirdwebContract } from "../../contract.js";
import { computePublishedContractAddress } from "../../../utils/any-evm/compute-published-contract-address.js";
import { computePublishedContractDeploymentInfo } from "../../../utils/any-evm/compute-published-contract-deploy-info.js";
import { prepareTransaction } from "../../../transaction/prepare-transaction.js";
import { getInitBytecodeWithSalt } from "../../../utils/any-evm/get-init-bytecode-with-salt.js";

export const INFRA_CONTRACTS = [
  { contractId: "TWCloneFactory", constructorParams: [] },
];

export type GetCloneFactoryParams = {
  client: ThirdwebClient;
  chain: Chain;
  contractId: string;
  constructorParams: unknown[];
};

/**
 * @internal
 */
export async function getDeployedPublishedContract(
  options: GetCloneFactoryParams,
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
export async function preparePublishedContractDeployTransaction(
  options: GetCloneFactoryParams,
) {
  const cloneFactoryInfo = await computePublishedContractDeploymentInfo({
    ...options,
  });
  const initBytecodeWithSalt = getInitBytecodeWithSalt({
    bytecode: cloneFactoryInfo.bytecode,
    encodedArgs: cloneFactoryInfo.encodedArgs,
    salt: cloneFactoryInfo.salt,
  });
  return prepareTransaction({
    ...options,
    to: cloneFactoryInfo.create2FactoryAddress,
    data: initBytecodeWithSalt,
  });
}

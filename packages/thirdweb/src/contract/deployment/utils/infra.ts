import { prepareTransaction } from "../../../transaction/prepare-transaction.js";
import { computePublishedContractAddress } from "../../../utils/any-evm/compute-published-contract-address.js";
import { computeDeploymentInfoFromContractId } from "../../../utils/any-evm/compute-published-contract-deploy-info.js";
import { isContractDeployed } from "../../../utils/bytecode/is-contract-deployed.js";
import type { Prettify } from "../../../utils/type-utils.js";
import type { ClientAndChain } from "../../../utils/types.js";
import { type ThirdwebContract, getContract } from "../../contract.js";
import { computeCreate2FactoryAddress } from "./create-2-factory.js";

export type InfraContractId =
  | "WETH9"
  | "Forwarder"
  | "ForwarderEOAOnly"
  | "TWCloneFactory"
  | (string & {});

export type GetDeployedInfraParams = Prettify<
  ClientAndChain & {
    contractId: InfraContractId;
    constructorParams: unknown[];
    publisher?: string;
    version?: string;
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
  }
  return null;
}

/**
 * @internal
 */
export function prepareInfraContractDeployTransaction(
  options: GetDeployedInfraParams,
) {
  const { client, chain } = options;
  return prepareTransaction({
    client,
    chain,
    to: () =>
      computeCreate2FactoryAddress({
        client,
        chain,
      }),
    data: async () => {
      const infraContractInfo =
        await computeDeploymentInfoFromContractId(options);
      return infraContractInfo.initBytecodeWithsalt;
    },
  });
}

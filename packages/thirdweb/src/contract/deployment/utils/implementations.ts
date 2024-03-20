import { computePublishedContractAddress } from "../../../utils/any-evm/compute-published-contract-address.js";
import { isContractDeployed } from "../../../utils/bytecode/is-contract-deployed.js";
import type { Prettify } from "../../../utils/type-utils.js";
import type { ClientAndChain } from "../../../utils/types.js";
import { getContract } from "../../contract.js";

export type GetDeployedImplementationParams = Prettify<
  ClientAndChain & {
    contractId: string;
    constructorParams: unknown[];
  }
>;

/**
 * @internal
 */
export async function getDeployedImplementationContract(
  args: GetDeployedImplementationParams,
) {
  const implementationAddress = await computePublishedContractAddress({
    chain: args.chain,
    client: args.client,
    contractId: args.contractId,
    constructorParams: args.constructorParams, // TODO guess this from the constructor abi
  });
  const implemetationContract = getContract({
    client: args.client,
    chain: args.chain,
    address: implementationAddress,
  });
  const isImplementationDeployed = await isContractDeployed(
    implemetationContract,
  );
  if (isImplementationDeployed) {
    return implemetationContract;
  }
  return null;
}

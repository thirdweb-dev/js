import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { isContractDeployed } from "../../../utils/bytecode/is-contract-deployed.js";
import { getContract, type ThirdwebContract } from "../../contract.js";
import { computePublishedContractAddress } from "./compute-published-contract-address.js";

export type GetCloneFactoryParams = {
  client: ThirdwebClient;
  chain: Chain;
};

/**
 * @internal
 */
export async function getCloneFactory(
  options: GetCloneFactoryParams,
): Promise<ThirdwebContract | null> {
  const address = await computePublishedContractAddress({
    ...options,
    contractId: "TWCloneFactory",
    constructorParams: [],
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
export async function deployCloneFactory(options: GetCloneFactoryParams) {
  console.log("TODO deployCloneFactory", options);
}

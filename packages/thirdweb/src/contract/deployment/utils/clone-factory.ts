import type { ClientAndChain } from "../../../utils/types.js";
import { getDeployedInfraContract } from "./infra.js";

/**
 * @internal
 */
export async function getDeployedCloneFactoryContract(args: ClientAndChain) {
  // check if Forwarder is deployed
  const forwarder = await getDeployedInfraContract({
    ...args,
    contractId: "Forwarder",
    constructorParams: [],
  });
  if (!forwarder) {
    return null;
  }

  // check if clone factory is deployed
  const cloneFactory = await getDeployedInfraContract({
    ...args,
    contractId: "TWCloneFactory",
    constructorParams: [forwarder.address],
  });
  if (!cloneFactory) {
    return null;
  }
  return cloneFactory;
}

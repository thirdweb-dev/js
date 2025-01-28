import type { ClientAndChain } from "../../../utils/types.js";
import { getDeployedInfraContract } from "./infra.js";

/**
 * Retrieves the deployed clone factory contract instance if available
 * @param args - Client and chain information required to locate the contract
 * @returns Promise that resolves to the clone factory contract instance if deployed, null otherwise
 *
 * @internal
 */
export async function getDeployedCloneFactoryContract(args: ClientAndChain) {
  // check if Forwarder is deployed
  const forwarder = await getDeployedInfraContract({
    ...args,
    contractId: "Forwarder",
  });
  if (!forwarder) {
    return null;
  }

  // check if clone factory is deployed
  const cloneFactory = await getDeployedInfraContract({
    ...args,
    contractId: "TWCloneFactory",
    constructorParams: { _trustedForwarder: forwarder.address },
    publisher: "0x6453a486d52e0EB6E79Ec4491038E2522a926936", // TODO: use default publisher
  });
  if (!cloneFactory) {
    return null;
  }
  return cloneFactory;
}

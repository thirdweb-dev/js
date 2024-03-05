import { prepareEvent } from "../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "ContractDeployed" event.
 */
export type ContractDeployedFilters = {
  deployer: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "deployer";
    type: "address";
  }>;
  publisher: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "publisher";
    type: "address";
  }>;
};

/**
 * Creates an event object for the ContractDeployed event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ICONTRACTDEPLOYER
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { contractDeployedEvent } from "thirdweb/extensions/IContractDeployer";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  contractDeployedEvent({
 *  deployer: ...,
 *  publisher: ...,
 * })
 * ],
 * });
 * ```
 */
export function contractDeployedEvent(filters: ContractDeployedFilters = {}) {
  return prepareEvent({
    signature:
      "event ContractDeployed(address indexed deployer, address indexed publisher, address deployedContract)",
    filters,
  });
}

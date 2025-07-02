import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the ContractDeployed event.
 * @returns The prepared event object.
 * @extension STYLUS
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { contractDeployedEvent } from "thirdweb/extensions/stylus";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  contractDeployedEvent()
 * ],
 * });
 * ```
 */
export function contractDeployedEvent() {
  return prepareEvent({
    signature: "event ContractDeployed(address deployedContract)",
  });
}

import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the ContractDeployed event.
 * @returns The prepared event object.
 * @extension TOKENS
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { contractDeployedEvent } from "thirdweb/extensions/tokens";
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
    signature:
      "event ContractDeployed(bytes32 id, uint256 version, address contractAddress, bytes32 salt)",
  });
}

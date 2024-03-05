import { prepareEvent } from "../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "Deposited" event.
 */
export type DepositedFilters = {
  account: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "account";
    type: "address";
  }>;
};

/**
 * Creates an event object for the Deposited event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension IENTRYPOINT
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { depositedEvent } from "thirdweb/extensions/IEntryPoint";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  depositedEvent({
 *  account: ...,
 * })
 * ],
 * });
 * ```
 */
export function depositedEvent(filters: DepositedFilters = {}) {
  return prepareEvent({
    signature: "event Deposited(address indexed account, uint256 totalDeposit)",
    filters,
  });
}

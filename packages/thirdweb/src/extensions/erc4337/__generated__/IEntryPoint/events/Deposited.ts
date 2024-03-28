import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "Deposited" event.
 */
export type DepositedEventFilters = Partial<{
  account: AbiParameterToPrimitiveType<{
    type: "address";
    name: "account";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the Deposited event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC4337
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { depositedEvent } from "thirdweb/extensions/erc4337";
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
export function depositedEvent(filters: DepositedEventFilters = {}) {
  return prepareEvent({
    signature: "event Deposited(address indexed account, uint256 totalDeposit)",
    filters,
  });
}

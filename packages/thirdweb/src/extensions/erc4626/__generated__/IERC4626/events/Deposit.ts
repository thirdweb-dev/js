import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "Deposit" event.
 */
export type DepositEventFilters = Partial<{
  caller: AbiParameterToPrimitiveType<{
    name: "caller";
    type: "address";
    indexed: true;
    internalType: "address";
  }>;
  owner: AbiParameterToPrimitiveType<{
    name: "owner";
    type: "address";
    indexed: true;
    internalType: "address";
  }>;
}>;

/**
 * Creates an event object for the Deposit event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC4626
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { depositEvent } from "thirdweb/extensions/erc4626";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  depositEvent({
 *  caller: ...,
 *  owner: ...,
 * })
 * ],
 * });
 * ```
 */
export function depositEvent(filters: DepositEventFilters = {}) {
  return prepareEvent({
    signature:
      "event Deposit(address indexed caller, address indexed owner, uint256 assets, uint256 shares)",
    filters,
  });
}

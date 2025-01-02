import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "Withdraw" event.
 */
export type WithdrawEventFilters = Partial<{
  caller: AbiParameterToPrimitiveType<{
    type: "address";
    name: "caller";
    indexed: true;
  }>;
  receiver: AbiParameterToPrimitiveType<{
    type: "address";
    name: "receiver";
    indexed: true;
  }>;
  owner: AbiParameterToPrimitiveType<{
    type: "address";
    name: "owner";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the Withdraw event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC4626
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { withdrawEvent } from "thirdweb/extensions/erc4626";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  withdrawEvent({
 *  caller: ...,
 *  receiver: ...,
 *  owner: ...,
 * })
 * ],
 * });
 * ```
 */
export function withdrawEvent(filters: WithdrawEventFilters = {}) {
  return prepareEvent({
    signature:
      "event Withdraw(address indexed caller, address indexed receiver, address indexed owner, uint256 assets, uint256 shares)",
    filters,
  });
}

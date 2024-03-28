import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "PoolCreated" event.
 */
export type PoolCreatedEventFilters = Partial<{
  token0: AbiParameterToPrimitiveType<{
    type: "address";
    name: "token0";
    indexed: true;
  }>;
  token1: AbiParameterToPrimitiveType<{
    type: "address";
    name: "token1";
    indexed: true;
  }>;
  sender: AbiParameterToPrimitiveType<{
    type: "address";
    name: "sender";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the PoolCreated event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension UNISWAP
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { poolCreatedEvent } from "thirdweb/extensions/uniswap";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  poolCreatedEvent({
 *  token0: ...,
 *  token1: ...,
 *  sender: ...,
 * })
 * ],
 * });
 * ```
 */
export function poolCreatedEvent(filters: PoolCreatedEventFilters = {}) {
  return prepareEvent({
    signature:
      "event PoolCreated(address indexed token0, address indexed token1, uint24 fee, int24 tickLower, int24 tickUpper, uint128 liquidity, address indexed sender)",
    filters,
  });
}

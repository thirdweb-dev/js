import type { AbiParameterToPrimitiveType } from "abitype";
import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Represents the filters for the "SwapExecuted" event.
 */
export type SwapExecutedEventFilters = Partial<{
  sender: AbiParameterToPrimitiveType<{
    type: "address";
    name: "sender";
    indexed: true;
  }>;
  tokenIn: AbiParameterToPrimitiveType<{
    type: "address";
    name: "tokenIn";
    indexed: true;
  }>;
  tokenOut: AbiParameterToPrimitiveType<{
    type: "address";
    name: "tokenOut";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the SwapExecuted event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ASSETS
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { swapExecutedEvent } from "thirdweb/extensions/assets";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  swapExecutedEvent({
 *  sender: ...,
 *  tokenIn: ...,
 *  tokenOut: ...,
 * })
 * ],
 * });
 * ```
 */
export function swapExecutedEvent(filters: SwapExecutedEventFilters = {}) {
  return prepareEvent({
    signature:
      "event SwapExecuted(address indexed sender, address indexed tokenIn, address indexed tokenOut, uint256 amountIn, uint256 amountOut, uint8 adapterUsed)",
    filters,
  });
}

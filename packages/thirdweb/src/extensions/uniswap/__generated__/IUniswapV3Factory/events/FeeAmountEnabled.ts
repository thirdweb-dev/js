import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the FeeAmountEnabled event.
 * @returns The prepared event object.
 * @extension UNISWAP
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { feeAmountEnabledEvent } from "thirdweb/extensions/uniswap";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  feeAmountEnabledEvent()
 * ],
 * });
 * ```
 */
export function feeAmountEnabledEvent() {
  return prepareEvent({
    signature: "event FeeAmountEnabled(uint24 fee, int24 tickSpacing)",
  });
}

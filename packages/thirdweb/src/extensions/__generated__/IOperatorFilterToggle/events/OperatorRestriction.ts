import { prepareEvent } from "../../../../event/prepare-event.js";

/**
 * Creates an event object for the OperatorRestriction event.
 * @returns The prepared event object.
 * @extension IOPERATORFILTERTOGGLE
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { operatorRestrictionEvent } from "thirdweb/extensions/IOperatorFilterToggle";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  operatorRestrictionEvent()
 * ],
 * });
 * ```
 */
export function operatorRestrictionEvent() {
  return prepareEvent({
    signature: "event OperatorRestriction(bool restriction)",
  });
}

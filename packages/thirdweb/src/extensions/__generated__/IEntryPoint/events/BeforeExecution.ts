import { prepareEvent } from "../../../../event/prepare-event.js";

/**
 * Creates an event object for the BeforeExecution event.
 * @returns The prepared event object.
 * @extension IENTRYPOINT
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { beforeExecutionEvent } from "thirdweb/extensions/IEntryPoint";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  beforeExecutionEvent()
 * ],
 * });
 * ```
 */
export function beforeExecutionEvent() {
  return prepareEvent({
    signature: "event BeforeExecution()",
  });
}

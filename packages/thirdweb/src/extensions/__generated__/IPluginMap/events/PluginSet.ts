import { prepareEvent } from "../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "PluginSet" event.
 */
export type PluginSetFilters = {
  functionSelector: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "bytes4";
    name: "functionSelector";
    type: "bytes4";
  }>;
  functionSignature: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "string";
    name: "functionSignature";
    type: "string";
  }>;
  pluginAddress: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "pluginAddress";
    type: "address";
  }>;
};

/**
 * Creates an event object for the PluginSet event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension IPLUGINMAP
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { pluginSetEvent } from "thirdweb/extensions/IPluginMap";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  pluginSetEvent({
 *  functionSelector: ...,
 *  functionSignature: ...,
 *  pluginAddress: ...,
 * })
 * ],
 * });
 * ```
 */
export function pluginSetEvent(filters: PluginSetFilters = {}) {
  return prepareEvent({
    signature:
      "event PluginSet(bytes4 indexed functionSelector, string indexed functionSignature, address indexed pluginAddress)",
    filters,
  });
}

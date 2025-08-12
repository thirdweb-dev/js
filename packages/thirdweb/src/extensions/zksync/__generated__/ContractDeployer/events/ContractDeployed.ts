import type { AbiParameterToPrimitiveType } from "abitype";
import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Represents the filters for the "ContractDeployed" event.
 */
export type ContractDeployedEventFilters = Partial<{
  deployerAddress: AbiParameterToPrimitiveType<{
    type: "address";
    name: "deployerAddress";
    indexed: true;
  }>;
  bytecodeHash: AbiParameterToPrimitiveType<{
    type: "bytes32";
    name: "bytecodeHash";
    indexed: true;
  }>;
  contractAddress: AbiParameterToPrimitiveType<{
    type: "address";
    name: "contractAddress";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the ContractDeployed event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ZKSYNC
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { contractDeployedEvent } from "thirdweb/extensions/zksync";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  contractDeployedEvent({
 *  deployerAddress: ...,
 *  bytecodeHash: ...,
 *  contractAddress: ...,
 * })
 * ],
 * });
 * ```
 */
export function contractDeployedEvent(
  filters: ContractDeployedEventFilters = {},
) {
  return prepareEvent({
    filters,
    signature:
      "event ContractDeployed(address indexed deployerAddress, bytes32 indexed bytecodeHash, address indexed contractAddress)",
  });
}

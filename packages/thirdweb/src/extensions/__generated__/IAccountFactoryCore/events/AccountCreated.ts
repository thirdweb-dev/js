import { prepareEvent } from "../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "AccountCreated" event.
 */
export type AccountCreatedFilters = {
  account: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "account";
    type: "address";
  }>;
  accountAdmin: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "accountAdmin";
    type: "address";
  }>;
};

/**
 * Creates an event object for the AccountCreated event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension IACCOUNTFACTORYCORE
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { accountCreatedEvent } from "thirdweb/extensions/IAccountFactoryCore";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  accountCreatedEvent({
 *  account: ...,
 *  accountAdmin: ...,
 * })
 * ],
 * });
 * ```
 */
export function accountCreatedEvent(filters: AccountCreatedFilters = {}) {
  return prepareEvent({
    signature:
      "event AccountCreated(address indexed account, address indexed accountAdmin)",
    filters,
  });
}

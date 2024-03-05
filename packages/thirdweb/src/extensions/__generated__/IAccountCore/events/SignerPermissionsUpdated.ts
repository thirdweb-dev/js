import { prepareEvent } from "../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "SignerPermissionsUpdated" event.
 */
export type SignerPermissionsUpdatedFilters = {
  authorizingSigner: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "authorizingSigner";
    type: "address";
  }>;
  targetSigner: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "targetSigner";
    type: "address";
  }>;
};

/**
 * Creates an event object for the SignerPermissionsUpdated event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension IACCOUNTCORE
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { signerPermissionsUpdatedEvent } from "thirdweb/extensions/IAccountCore";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  signerPermissionsUpdatedEvent({
 *  authorizingSigner: ...,
 *  targetSigner: ...,
 * })
 * ],
 * });
 * ```
 */
export function signerPermissionsUpdatedEvent(
  filters: SignerPermissionsUpdatedFilters = {},
) {
  return prepareEvent({
    signature:
      "event SignerPermissionsUpdated(address indexed authorizingSigner, address indexed targetSigner, (address signer, uint8 isAdmin, address[] approvedTargets, uint256 nativeTokenLimitPerTransaction, uint128 permissionStartTimestamp, uint128 permissionEndTimestamp, uint128 reqValidityStartTimestamp, uint128 reqValidityEndTimestamp, bytes32 uid) permissions)",
    filters,
  });
}

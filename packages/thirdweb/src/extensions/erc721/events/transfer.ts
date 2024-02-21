import type { Address } from "abitype";
import { prepareEvent } from "../../../event/prepare-event.js";

export type TransferEventFilters = {
  from?: Address;
  to?: Address;
  tokenId?: bigint;
};

/**
 * Creates an event object for the Transfer event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC721
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { transferEvent } from "thirdweb/extensions/erc721";
 *
 * const events = await getContractEvents({
 *  contract,
 *  event: transferEvent({ from: "0x1234..." }),
 * });
 * ```
 */
export function transferEvent(filters: TransferEventFilters = {}) {
  return prepareEvent({
    signature:
      "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
    filters,
  });
}

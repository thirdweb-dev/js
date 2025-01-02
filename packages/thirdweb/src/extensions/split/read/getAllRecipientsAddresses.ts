import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { payee } from "../__generated__/Split/read/payee.js";
import { payeeCount } from "../__generated__/Split/read/payeeCount.js";

/**
 * Get the addresses of all recipients of a [`thirdweb Split contract`](https://thirdweb.com/thirdweb.eth/Split)
 * @extension SPLIT
 * @returns an array of wallet addresses
 *
 * @example
 * ```ts
 * import { getAllRecipientsAddresses } from "thirdweb/extensions/split";
 *
 * const addresses = await getAllRecipientsAddresses({ contract });
 */
export async function getAllRecipientsAddresses(
  options: BaseTransactionOptions,
): Promise<string[]> {
  const { contract } = options;
  const _totalRecipients = await payeeCount(options);
  const indexes = Array.from({ length: Number(_totalRecipients) }, (_, i) => i);
  const recipientAddresses = await Promise.all(
    indexes.map((index) => payee({ contract, index: BigInt(index) })),
  );
  return recipientAddresses;
}

import type { Address } from "abitype";
import { multicall } from "../../../../extensions/common/__generated__/IMulticall/write/multicall.js";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../transaction/types.js";
import { getClaimParams } from "../../../../utils/extensions/drops/get-claim-params.js";
import { encodeClaim } from "../../__generated__/IDrop/write/claim.js";

/**
 * @extension ERC721
 */
export type ClaimToBatchParams = WithOverrides<{
  content: Array<{
    to: Address;
    quantity: bigint;
  }>;
  from?: Address;
}>;

/**
 * This extension batches multiple `claimTo` extensions into one single multicall.
 * Keep in mind that there is a limit of how many NFTs you can claim per transaction.
 * This limit varies depends on the network that you are transacting on.
 * This method is only available on the `DropERC721` contract.
 *
 * You are recommended to experiment with the number to figure out the best number for your chain of choice.
 * @extension ERC721
 * @param options the transaction options
 * @returns A promise that resolves to the transaction result.
 *
 * @example
 * ```ts
 * import { claimToBatch } from "thirdweb/extensions/erc721";
 *
 * const transaction = claimToBatch({
 *   contract: nftDropContract,
 *   from: claimer.address, // address of the one calling this transaction
 *   content: [
 *     { to: "0x...1", quantity: 1n },
 *     { to: "0x...2", quantity: 12n },
 *     { to: "0x...3", quantity: 2n },
 *   ],
 * });
 * ```
 */
export function claimToBatch(
  options: BaseTransactionOptions<ClaimToBatchParams>,
) {
  return multicall({
    asyncParams: () => getClaimToBatchParams(options),
    contract: options.contract,
    overrides: options.overrides,
  });
}

/**
 * @internal
 */
async function getClaimToBatchParams(
  options: BaseTransactionOptions<ClaimToBatchParams>,
) {
  for (let i = 0; i < options.content.length; i++) {
    if (!options.content[i]?.quantity) {
      throw new Error(`Error: Item at index ${i} is missing claim quantity`);
    }
    if (!options.content[i]?.to) {
      throw new Error(
        `Error: Item at index ${i} is missing recipient address ("to")`,
      );
    }
  }
  const content = optimizeClaimContent(options.content);
  const data = await Promise.all(
    content.map(async (item) => {
      const claimParams = await getClaimParams({
        contract: options.contract,
        from: options.from,
        quantity: item.quantity,
        to: item.to,
        type: "erc721",
      });

      return encodeClaim({
        allowlistProof: claimParams.allowlistProof,
        currency: claimParams.currency,
        data: claimParams.data,
        overrides: claimParams.overrides,
        pricePerToken: claimParams.pricePerToken,
        quantity: claimParams.quantity,
        receiver: claimParams.receiver,
      });
    }),
  );

  return { data };
}

/**
 * Optimization
 * For identical addresses that stays next to each other in the array,
 * we can combine them into one transaction _without altering the claiming order_
 *
 * For example, this structure:
 * [
 *   {
 *     to: "0xabc",
 *     quantity: 1n,
 *   },
 *   {
 *     to: "0xabc",
 *     quantity: 13n,
 *   },
 * ];
 *
 * ...can be combined in one tx (without altering the claiming order)
 * {
 *   to: "0xabc",
 *   quantity: 14n,
 * }
 *
 * @internal
 */
export function optimizeClaimContent(
  content: Array<{ to: Address; quantity: bigint }>,
): Array<{ to: Address; quantity: bigint }> {
  const results: Array<{ to: Address; quantity: bigint }> = [];
  content.forEach((item, index) => {
    const previousItem = results.at(-1);
    if (
      index > 0 &&
      previousItem &&
      item.to.toLowerCase() === previousItem.to.toLowerCase()
    ) {
      results[results.length - 1] = {
        quantity: item.quantity + previousItem.quantity,
        to: item.to,
      };
    } else {
      results.push(item);
    }
  });
  return results;
}

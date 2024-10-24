import type { Address } from "abitype";
import { multicall } from "../../../../extensions/common/__generated__/IMulticall/write/multicall.js";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../transaction/types.js";
import { getClaimParams } from "../../../../utils/extensions/drops/get-claim-params.js";
import { resolvePromisedValue } from "../../../../utils/promise/resolve-promised-value.js";
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
    contract: options.contract,
    asyncParams: () => getClaimToBatchParams(options),
    overrides: {
      erc20Value: getERC20Value(options),
      ...options.overrides,
    },
  });
}

/**
 * @internal
 */
async function getClaimToBatchParams(
  options: BaseTransactionOptions<ClaimToBatchParams>,
) {
  const errorIndexTo = options.content.findIndex((o) => !o.to);
  if (errorIndexTo !== -1) {
    throw new Error(
      `Error: Item at index ${errorIndexTo} is missing recipient address ("to")`,
    );
  }
  const errorIndexQuantity = options.content.findIndex((o) => !o.quantity);
  if (errorIndexQuantity !== -1) {
    throw new Error(
      `Error: Item at index ${errorIndexQuantity} is missing claim quantity`,
    );
  }
  const content = optimizeClaimContent(options.content);
  const data = await Promise.all(
    content.map(async (item) => {
      const claimParams = await getClaimParams({
        type: "erc721",
        contract: options.contract,
        to: item.to,
        from: options.from,
        quantity: item.quantity,
      });

      return encodeClaim({
        receiver: claimParams.receiver,
        quantity: claimParams.quantity,
        currency: claimParams.currency,
        pricePerToken: claimParams.pricePerToken,
        allowlistProof: claimParams.allowlistProof,
        data: claimParams.data,
      });
    }),
  );

  return { data };
}

/**
 * @internal
 */
async function getERC20Value(
  options: BaseTransactionOptions<ClaimToBatchParams>,
): Promise<
  | {
      amountWei: bigint;
      tokenAddress: string;
    }
  | undefined
> {
  const data = await Promise.all(
    options.content.map(async (item) => {
      const claimParams = await getClaimParams({
        type: "erc721",
        contract: options.contract,
        to: item.to,
        from: options.from,
        quantity: item.quantity,
      });
      const erc20Value = await resolvePromisedValue(
        claimParams.overrides.erc20Value,
      );
      return erc20Value;
    }),
  );

  const filteredData = data.filter((item) => item !== undefined);

  if (!filteredData.length || !filteredData[0]) {
    return undefined;
  }

  const totalAmountWei = filteredData
    .filter((item) => item !== undefined)
    .reduce(
      (accumulator, currentValue) => accumulator + currentValue.amountWei,
      BigInt(0),
    );

  return {
    amountWei: totalAmountWei,
    tokenAddress: filteredData[0].tokenAddress,
  };
}

/**
 * Optimization
 * For identical addresses that stays next to each other in the array,
 * we can combine them into one transaction _without altering the claiming order_
 *
 * For exampple, this structure:
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
        to: item.to,
        quantity: item.quantity + previousItem.quantity,
      };
    } else {
      results.push(item);
    }
  });
  return results;
}

import type { BaseTransactionOptions } from "../../../transaction/types.js";
import type { Prettify } from "../../../utils/type-utils.js";
import { toUnits } from "../../../utils/units.js";
import { multicall } from "../../common/__generated__/IMulticall/write/multicall.js";
import { encodeTransfer } from "../__generated__/IERC20/write/transfer.js";

/**
 * Represents the parameters for a batch transfer operation.
 * @extension ERC20
 */
export type TransferBatchParams = Prettify<{
  batch: Array<
    { to: string } & (
      | {
          amount: number | string;
        }
      | {
          amountWei: bigint;
        }
    )
  >;
}>;

/**
 * Transfers a batch of ERC20 tokens from the sender's address to the specified recipient address.
 * @param options - The options for the batch transfer transaction.
 * @returns A promise that resolves to the prepared transaction.
 * @extension ERC20
 * @example
 * ```ts
 * import { transferBatch } from "thirdweb/extensions/erc20";
 * import { sendTransaction } from "thirdweb";
 *
 * const transaction = transferBatch({
 *  contract,
 *  batch: [
 *    {
 *      to: "0x...",
 *      amount: 100,
 *    },
 *    {
 *      to: "0x...",
 *      amount: "0.1",
 *    },
 * ]);
 *
 * await sendTransaction({ transaction, account });
 * ```
 */
export function transferBatch(
  options: BaseTransactionOptions<TransferBatchParams>,
) {
  return multicall({
    asyncParams: async () => {
      const content = await optimizeTransferContent(options);
      return {
        data: content.map((item) => {
          return encodeTransfer({
            overrides: {
              erc20Value: {
                amountWei: item.amountWei,
                tokenAddress: options.contract.address,
              },
            },
            to: item.to,
            value: item.amountWei,
          });
        }),
      };
    },
    contract: options.contract,
  });
}

/**
 * Records with the same recipient (`to`) can be packed into one transaction
 * For example, the data below:
 * ```ts
 * [
 *   {
 *     to: "wallet-a",
 *     amount: 1,
 *   },
 *   {
 *     to: "wallet-A",
 *     amountWei: 1000000000000000000n,
 *   },
 * ]
 * ```
 *
 * can be packed to:
 * ```ts
 * [
 *   {
 *     to: "wallet-a",
 *     amountWei: 2000000000000000000n,
 *   },
 * ]
 * ```
 * @internal
 */
export async function optimizeTransferContent(
  options: BaseTransactionOptions<TransferBatchParams>,
): Promise<Array<{ to: string; amountWei: bigint }>> {
  const groupedRecords = await options.batch.reduce(
    async (accPromise, record) => {
      const acc = await accPromise;
      let amountInWei: bigint;
      if ("amount" in record) {
        // it's OK to call this multiple times because the call is cached
        const { decimals } = await import("../read/decimals.js");
        // if this fails we fall back to `18` decimals
        const d = await decimals(options).catch(() => undefined);
        if (d === undefined) {
          throw new Error(
            `Failed to get the decimals for contract: ${options.contract.address}`,
          );
        }
        amountInWei = toUnits(record.amount.toString(), d);
      } else {
        amountInWei = record.amountWei;
      }
      const existingRecord = acc.find(
        (r) => r.to.toLowerCase() === record.to.toLowerCase(),
      );
      if (existingRecord) {
        existingRecord.amountWei = existingRecord.amountWei + amountInWei;
      } else {
        acc.push({
          amountWei: amountInWei,
          to: record.to,
        });
      }

      return acc;
    },
    Promise.resolve([] as { to: string; amountWei: bigint }[]),
  );
  return groupedRecords;
}

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
    contract: options.contract,
    asyncParams: async () => {
      return {
        data: await Promise.all(
          options.batch.map(async (transfer) => {
            let amount: bigint;
            if ("amount" in transfer) {
              // if we need to parse the amount from ether to gwei then we pull in the decimals extension
              const { decimals } = await import("../read/decimals.js");
              // it's OK to call this multiple times because the call is cached
              // if this fails we fall back to `18` decimals
              const d = await decimals(options).catch(() => 18);
              // turn ether into gwei
              amount = toUnits(transfer.amount.toString(), d);
            } else {
              amount = transfer.amountWei;
            }
            return encodeTransfer({
              to: transfer.to,
              value: amount,
              overrides: {
                erc20Value: {
                  amountWei: amount,
                  tokenAddress: options.contract.address,
                },
              },
            });
          }),
        ),
      };
    },
  });
}

import { type UseMutationResult, useMutation } from "@tanstack/react-query";
import type { Abi, AbiFunction } from "abitype";
import {
  type SimulateOptions,
  simulateTransaction,
} from "../../../../transaction/actions/simulate.js";

/**
 * A hook to simulate a transaction.
 * @returns A mutation object to simulate a transaction.
 * @example
 * ```jsx
 * import { useSimulateTransaction } from "thirdweb/react";
 * const { mutate: simulateTx } = useSimulateTransaction();
 *
 * // later
 * const result = await simulateTx(tx);
 * ```
 * @transaction
 */
export function useSimulateTransaction<
  const abi extends Abi,
  const abiFn extends AbiFunction,
>(): UseMutationResult<
  Awaited<ReturnType<typeof simulateTransaction>>,
  Error,
  SimulateOptions<abi, abiFn>
> {
  return useMutation({
    mutationFn: (options) => simulateTransaction(options),
  });
}

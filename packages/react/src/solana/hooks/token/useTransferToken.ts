import { createSOLProgramQueryKey } from "../../../core/query-utils/query-key";
import {
  requiredParamInvariant,
  RequiredParam,
} from "../../../core/query-utils/required-param";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Amount } from "@thirdweb-dev/sdk";
import type { Token } from "@thirdweb-dev/sdk/solana";

export type TransferTokenMutationParams = {
  amount: Amount;
  receiverAddress: string;
};

/**
 * Transfer tokens from the connected wallet to another wallet
 * @param program - The program instance of the program to mint on
 *
 * @example
 * ```jsx
 * import { useProgram, useTransferToken } from "@thirdweb-dev/react/solana";
 *
 * export default function Component() {
 *   const { program } = useProgram("{{program_address}}");
 *   const { mutateAsync: transfer, isLoading, error } = useTransferToken(program);
 *
 *   return (
 *     <button onClick={() => transfer({ to: "{{wallet_address}}", amount: 1 })}>
 *       Transfer
 *     </button>
 *   )
 * }
 * ```
 *
 * @public
 */
export function useTransferToken(program: RequiredParam<Token>) {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ amount, receiverAddress }: TransferTokenMutationParams) => {
      requiredParamInvariant(program, "program is required");
      return await program.transfer(receiverAddress, amount);
    },
    {
      onSettled: () =>
        queryClient.invalidateQueries(createSOLProgramQueryKey(program)),
    },
  );
}

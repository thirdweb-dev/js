import { createSOLProgramQueryKey } from "../../../core/query-utils/query-key";
import { RequiredParam } from "../../../core/types/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Amount, Token } from "@thirdweb-dev/solana";
import invariant from "tiny-invariant";

export type TransferTokenMutationParams = {
  amount: Amount;
  receiverAddress: string;
};

export function useTransferToken(program: RequiredParam<Token>) {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ amount, receiverAddress }: TransferTokenMutationParams) => {
      invariant(program, "program is required");
      return await program.transfer(receiverAddress, amount);
    },
    {
      onSettled: () =>
        queryClient.invalidateQueries(createSOLProgramQueryKey(program)),
    },
  );
}

import { createSOLProgramQueryKey } from "../../../core/query-utils/query-key";
import { RequiredParam } from "../../../core/types/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Amount, Token } from "@thirdweb-dev/solana";
import invariant from "tiny-invariant";

export function useMintToken(program: RequiredParam<Token>) {
  const queryClient = useQueryClient();
  return useMutation(
    async (amount: Amount) => {
      invariant(program, "program is required");
      return await program.mint(amount);
    },
    {
      onSettled: () =>
        queryClient.invalidateQueries(createSOLProgramQueryKey(program)),
    },
  );
}

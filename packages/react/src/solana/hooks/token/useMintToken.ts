import { createSOLProgramQueryKey } from "../../../core/query-utils/query-key";
import { RequiredParam } from "../../../core/types/shared";
import type { TokenParams } from "../../../evm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Token } from "@thirdweb-dev/sdk/solana";
import invariant from "tiny-invariant";

export function useMintToken(program: RequiredParam<Token>) {
  const queryClient = useQueryClient();
  return useMutation(
    async (params: TokenParams) => {
      invariant(program, "program is required");
      // TODO switch this to use mintTo once that is exposed
      return await program.mint(params.amount);
    },
    {
      onSettled: () =>
        queryClient.invalidateQueries(createSOLProgramQueryKey(program)),
    },
  );
}

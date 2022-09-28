import { createSOLProgramQueryKey } from "../../../core/query-utils/query-key";
import { RequiredParam } from "../../../core/types/shared";
import { useQuery } from "@tanstack/react-query";
import { Token } from "@thirdweb-dev/sdk/solana";
import invariant from "tiny-invariant";

export function tokenSupplyQuery(program: RequiredParam<Token>) {
  return {
    queryKey: createSOLProgramQueryKey(program, ["totalSupply"] as const),
    queryFn: async () => {
      invariant(program, "program is required");

      return await program.totalSupply();
    },
    enabled: !!program,
  };
}

export function useTokenSupply(program: RequiredParam<Token>) {
  return useQuery(tokenSupplyQuery(program));
}

import { createSOLProgramQueryKey } from "../../../../core/query-utils/query-key";
import { RequiredParam } from "../../../../core/types/shared";
import { useQuery } from "@tanstack/react-query";
import type { NFTDrop } from "@thirdweb-dev/solana";
import invariant from "tiny-invariant";

export function dropTotalClaimedSupplyQuery(program: RequiredParam<NFTDrop>) {
  return {
    queryKey: createSOLProgramQueryKey(program, [
      "totalClaimedSupply",
    ] as const),

    queryFn: async () => {
      invariant(program, "program is required");

      return await program.totalClaimedSupply();
    },
    enabled: !!program,
  };
}

export function useDropTotalClaimedSupply(program: RequiredParam<NFTDrop>) {
  return useQuery(dropTotalClaimedSupplyQuery(program));
}

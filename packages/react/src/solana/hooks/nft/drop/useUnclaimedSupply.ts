import { createSOLProgramQueryKey } from "../../../../core/query-utils/query-key";
import { RequiredParam } from "../../../../core/types/shared";
import { useQuery } from "@tanstack/react-query";
import type { NFTDrop } from "@thirdweb-dev/sdk/solana";
import invariant from "tiny-invariant";

export function dropUnclaimedSupplyQuery(program: RequiredParam<NFTDrop>) {
  return {
    queryKey: createSOLProgramQueryKey(program, [
      "totalUnclaimedSupply",
    ] as const),

    queryFn: async () => {
      invariant(program, "program is required");

      return await program.totalUnclaimedSupply();
    },
    enabled: !!program,
  };
}

export function useDropUnclaimedSupply(program: RequiredParam<NFTDrop>) {
  return useQuery(dropUnclaimedSupplyQuery(program));
}

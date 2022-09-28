import { createSOLProgramQueryKey } from "../../../core/query-utils/query-key";
import { RequiredParam } from "../../../core/types/shared";
import { useQuery } from "@tanstack/react-query";
import type { NFTCollection, NFTDrop } from "@thirdweb-dev/sdk/solana";
import invariant from "tiny-invariant";

export function nftGetAllQuery(
  program: RequiredParam<NFTCollection | NFTDrop>,
) {
  return {
    queryKey: createSOLProgramQueryKey(program, ["getAll"] as const),

    queryFn: async () => {
      invariant(program, "program is required");
      return await program.getAll();
    },
    enabled: !!program,
  };
}

export function useNFTs(program: RequiredParam<NFTCollection | NFTDrop>) {
  return useQuery(nftGetAllQuery(program));
}

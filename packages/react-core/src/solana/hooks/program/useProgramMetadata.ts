import { createSOLProgramQueryKey } from "../../../core/query-utils/query-key";
import { RequiredParam } from "../../../core/query-utils/required-param";
import { UseProgramResult } from "./useProgram";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { NFTMetadata } from "@thirdweb-dev/sdk";
import invariant from "tiny-invariant";

export function programMetadataQuery(
  program: RequiredParam<UseProgramResult["program"]>,
): {
  queryKey: ReturnType<typeof createSOLProgramQueryKey>;
  queryFn(): Promise<NFTMetadata>;
  enabled: boolean;
} {
  return {
    queryKey: createSOLProgramQueryKey(program || null, ["metadata"] as const),
    queryFn: async () => {
      invariant(program, "sdk is required");

      return (await program.getMetadata()) as NFTMetadata;
    },
    enabled: !!program,
  };
}

/**
 * @internal
 */
export function useProgramMetadata(
  program: RequiredParam<UseProgramResult["data"]>,
): UseQueryResult<NFTMetadata> {
  return useQuery(programMetadataQuery(program));
}

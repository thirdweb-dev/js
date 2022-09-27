import { createSOLProgramQueryKey } from "../../../core/query-utils/query-key";
import { RequiredParam } from "../../../core/types/shared";
import { UseProgramResult } from "./useProgram";
import { useQuery } from "@tanstack/react-query";
import invariant from "tiny-invariant";

export function programMetadataQuery(
  program: RequiredParam<UseProgramResult["data"]>,
) {
  return {
    queryKey: createSOLProgramQueryKey(program || null, ["metadata"] as const),
    queryFn: async () => {
      invariant(program, "sdk is required");

      return await program.getMetadata();
    },
    enabled: !!program,
  };
}

export function useProgramMetadata(
  program: RequiredParam<UseProgramResult["data"]>,
) {
  return useQuery(programMetadataQuery(program));
}

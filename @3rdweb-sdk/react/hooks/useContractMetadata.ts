import { contractKeys, networkKeys } from "../cache-keys";
import { useQuery } from "@tanstack/react-query";
import {
  PrebuiltContractType,
  SchemaForPrebuiltContractType,
} from "@thirdweb-dev/sdk";
import { z } from "zod";

export function useContractMetadataWithAddress(
  address: string,
  queryFn: () => Promise<
    z.infer<SchemaForPrebuiltContractType<PrebuiltContractType>["output"]>
  >,
  chainId: number,
) {
  return useQuery(
    [...networkKeys.chain(chainId), ...contractKeys.detail(address)],
    () => queryFn(),
    { enabled: !!address && typeof queryFn === "function" && !!chainId },
  );
}

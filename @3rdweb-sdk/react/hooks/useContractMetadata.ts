import { contractKeys, networkKeys } from "../cache-keys";
import { useQuery } from "@tanstack/react-query";
import {
  PrebuiltContractType,
  SUPPORTED_CHAIN_ID,
  SchemaForPrebuiltContractType,
} from "@thirdweb-dev/sdk/evm";
import { z } from "zod";

export function useContractMetadataWithAddress(
  address: string,
  queryFn: () => Promise<
    z.infer<SchemaForPrebuiltContractType<PrebuiltContractType>["output"]>
  >,
  chainId: SUPPORTED_CHAIN_ID,
) {
  return useQuery(
    [...networkKeys.chain(chainId), ...contractKeys.detail(address)],
    () => queryFn(),
    { enabled: !!address && typeof queryFn === "function" && !!chainId },
  );
}

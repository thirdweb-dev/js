import { createSOLQueryKeyWithNetwork } from "../../../core/query-utils/query-key";
import {
  requiredParamInvariant,
  RequiredParam,
} from "../../../core/query-utils/required-param";
import { useSDK } from "../../providers/base";
import { useQuery } from "@tanstack/react-query";
import type { ThirdwebSDK } from "@thirdweb-dev/sdk/solana";

export function programAccountTypeQuery(
  sdk: RequiredParam<ThirdwebSDK>,
  address: RequiredParam<string>,
) {
  const network = sdk?.network;
  return {
    queryKey: createSOLQueryKeyWithNetwork(
      ["program", address, "type"] as const,
      network || null,
    ),
    queryFn: async () => {
      requiredParamInvariant(sdk, "sdk is required");
      requiredParamInvariant(address, "Address is required");

      return await sdk.registry.getProgramType(address);
    },
    enabled: !!sdk && !!network && !!address,
    // this cannot change as it is unique by address & network
    cacheTime: Infinity,
    staleTime: Infinity,
  };
}

/**
 * @internal
 */
export function useProgramAccountType(address: RequiredParam<string>) {
  const sdk = useSDK();
  return useQuery(programAccountTypeQuery(sdk, address));
}

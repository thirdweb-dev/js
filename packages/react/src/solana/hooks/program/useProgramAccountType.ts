import { createSOLQueryKeyWithNetwork } from "../../../core/query-utils/query-key";
import { RequiredParam } from "../../../core/types/shared";
import { useSDK } from "../../providers/base";
import { useQuery } from "@tanstack/react-query";
import type { ThirdwebSDK } from "@thirdweb-dev/solana";
import invariant from "tiny-invariant";

export function programAccountTypeQuery(
  sdk: RequiredParam<ThirdwebSDK>,
  address: RequiredParam<string>,
) {
  const network = sdk?.metaplex.cluster;
  return {
    queryKey: createSOLQueryKeyWithNetwork(
      ["program", address, "type"] as const,
      network || null,
    ),
    queryFn: async () => {
      invariant(sdk, "sdk is required");
      invariant(address, "Address is required");

      return await sdk.registry.getAccountType(address);
    },
    enabled: !!sdk && !!network && !!address,
    // this cannot change as it is unique by address & network
    cacheTime: Infinity,
    staleTime: Infinity,
  };
}

export function useProgramAccountType(address: RequiredParam<string>) {
  const sdk = useSDK();
  return useQuery(programAccountTypeQuery(sdk, address));
}

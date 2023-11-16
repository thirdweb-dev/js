import { ChainIdOrName, SDKOptions, ThirdwebSDK } from "@thirdweb-dev/sdk/internal/react-core";
import type { ThirdwebStorage } from "@thirdweb-dev/storage";
import { useMemo } from "react";

/**
 * @internal
 */
export function useReadonlySDK(
  readonlyRpcUrl: ChainIdOrName,
  sdkOptions: SDKOptions,
  storageInterface?: ThirdwebStorage,
): ThirdwebSDK {
  return useMemo(() => {
    return new ThirdwebSDK(readonlyRpcUrl, sdkOptions, storageInterface);
    // storageInterface should be constant!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readonlyRpcUrl, sdkOptions]);
}

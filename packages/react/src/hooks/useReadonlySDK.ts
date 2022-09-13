import { SDKOptions, ThirdwebSDK } from "@thirdweb-dev/sdk";
import type { IStorage } from "@thirdweb-dev/storage";
import { useMemo } from "react";

/**
 * @internal
 */
export function useReadonlySDK(
  readonlyRpcUrl: string,
  sdkOptions: SDKOptions,
  storageInterface?: IStorage,
): ThirdwebSDK {
  return useMemo(() => {
    return new ThirdwebSDK(
      readonlyRpcUrl,
      {
        ...sdkOptions,
        readonlySettings: {
          ...sdkOptions?.readonlySettings,
          rpcUrl: readonlyRpcUrl,
        },
      },
      storageInterface,
    );
    // storageInterface should be constant!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readonlyRpcUrl, sdkOptions]);
}

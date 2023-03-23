import { updateChainRPCs } from "../../core/utils/updateChainRpcs";
import { ThirdwebSDKProviderProps } from "../providers/types";
import { useMemo } from "react";

export function useUpdateChainsWithApiKeys(
  supportedChains: NonNullable<ThirdwebSDKProviderProps["supportedChains"]>,
  activeChain: ThirdwebSDKProviderProps["activeChain"],
  thirdwebApiKey?: string,
  alchemyApiKey?: string,
  infuraApiKey?: string,
) {
  const keys = useMemo(
    () => ({
      thirdwebApiKey: thirdwebApiKey,
      alchemyApiKey: alchemyApiKey,
      infuraApiKey: infuraApiKey,
    }),
    [thirdwebApiKey, alchemyApiKey, infuraApiKey],
  );

  const supportedChainsWithKey = useMemo(() => {
    return supportedChains.map((chain) => updateChainRPCs(chain, keys));
  }, [supportedChains, keys]);

  const activeChainIdOrObjWithKey = useMemo(() => {
    if (
      !activeChain ||
      typeof activeChain === "string" ||
      typeof activeChain === "number"
    ) {
      return activeChain;
    }

    return updateChainRPCs(activeChain, keys);
  }, [activeChain, keys]);

  return [supportedChainsWithKey, activeChainIdOrObjWithKey] as const;
}

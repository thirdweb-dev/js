import { useMemo } from "react";
import { updateChainRPCs } from "../../core/utils/updateChainRpcs";
import { ThirdwebSDKProviderProps } from "../providers/types";

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

  const _supportedChains = useMemo(() => {
    return supportedChains.map((chain) => updateChainRPCs(chain, keys));
  }, [supportedChains, keys]);

  const _activeChain = useMemo(() => {
    if (
      !activeChain ||
      typeof activeChain === "string" ||
      typeof activeChain === "number"
    ) {
      return activeChain;
    }

    return updateChainRPCs(activeChain, keys);
  }, [activeChain, keys]);

  return [_supportedChains, _activeChain] as const;
}

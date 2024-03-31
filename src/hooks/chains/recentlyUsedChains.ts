import { useSupportedChainsRecord } from "./configureChains";
import {
  AddRecentlyUsedChainIdsContext,
  RecentlyUsedChainIdsContext,
  SupportedChainsReadyContext,
} from "contexts/configured-chains";
import { useContext, useMemo } from "react";
import invariant from "tiny-invariant";

export function useRecentlyUsedChains() {
  const recentlyUsedChainIds = useContext(RecentlyUsedChainIdsContext);
  const supportedChainsRecord = useSupportedChainsRecord();

  const isSupportedChainsReady = useContext(SupportedChainsReadyContext);

  const recentlyUsedChains = useMemo(() => {
    if (!recentlyUsedChainIds || !isSupportedChainsReady) {
      return [];
    }
    return recentlyUsedChainIds.map(
      (chainId) => supportedChainsRecord[chainId],
    );
  }, [supportedChainsRecord, recentlyUsedChainIds, isSupportedChainsReady]);

  invariant(
    recentlyUsedChainIds,
    "useRecentlyUsedChains must be used within RecentlyUsedChainIdsContext",
  );

  return recentlyUsedChains;
}

export function useAddRecentlyUsedChainId() {
  const context = useContext(AddRecentlyUsedChainIdsContext);
  invariant(
    context,
    "useAddRecentlyUsedChainId must be used within AddRecentlyUsedChainIdsContext",
  );
  return context;
}

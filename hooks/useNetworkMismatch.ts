import { useWeb3 } from "@3rdweb-sdk/react";
import { useActiveChainId } from "@3rdweb-sdk/react/hooks/useActiveChainId";
import { useMemo } from "react";

export function useNetworkMismatch(): boolean {
  const { address, chainId } = useWeb3();
  const activeChainId = useActiveChainId();
  return useMemo(() => {
    const signerChainId = chainId;
    if (
      !address ||
      !chainId ||
      !activeChainId ||
      signerChainId === activeChainId
    ) {
      return false;
    }
    return true;
  }, [address, activeChainId, chainId]);
}

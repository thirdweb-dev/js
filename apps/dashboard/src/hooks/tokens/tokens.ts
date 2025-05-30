import { getUniversalBridgeTokens } from "@/api/universal-bridge/tokens";
import { useQuery } from "@tanstack/react-query";

export function useTokensData({
  chainId,
  enabled,
}: { chainId?: number; enabled?: boolean }) {
  return useQuery({
    queryKey: ["universal-bridge-tokens", chainId],
    queryFn: () => getUniversalBridgeTokens({ chainId }),
    enabled,
  });
}

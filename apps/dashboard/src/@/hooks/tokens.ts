import { useQuery } from "@tanstack/react-query";
import { getUniversalBridgeTokens } from "@/api/universal-bridge/token-list";

export function useTokensData({
  chainId,
  enabled,
}: {
  chainId?: number;
  enabled?: boolean;
}) {
  return useQuery({
    enabled,
    queryFn: () => getUniversalBridgeTokens({ chainId }),
    queryKey: ["universal-bridge-tokens", chainId],
  });
}

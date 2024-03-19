import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { resolveScheme } from "../../../../utils/ipfs.js";
import { resolveMimeType } from "../../utils/resolveMimeType.js";
import type { ThirdwebClient } from "../../../../client/client.js";

/**
 * @internal
 */
export function useResolvedMediaType(
  client: ThirdwebClient,
  uri?: string,
  mimeType?: string,
  gatewayUrl?: string,
) {
  const resolvedUrl = useMemo(() => {
    if (!uri) {
      return "";
    }
    if (gatewayUrl) {
      return uri.replace("ipfs://", gatewayUrl);
    }
    try {
      return resolveScheme({
        client,
        uri,
      });
    } catch {
      return uri.replace("ipfs://", "https://ipfs.io/ipfs/");
    }
  }, [uri, gatewayUrl, client]);

  const resolvedMimType = useQuery({
    queryKey: ["mime-type", resolvedUrl],
    queryFn: () => resolveMimeType(resolvedUrl),
    enabled: !!resolvedUrl && !mimeType,
    initialData: mimeType,
  });

  return {
    url: resolvedUrl,
    mimeType: resolvedMimType.data,
  };
}

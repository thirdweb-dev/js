import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import type { ThirdwebClient } from "../../../../client/client.js";
import { resolveArweaveScheme } from "../../../../utils/arweave.js";
import { resolveScheme } from "../../../../utils/ipfs.js";
import { resolveMimeType } from "../../utils/resolveMimeType.js";

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
    if (uri.startsWith("ar://")) {
      return resolveArweaveScheme({ uri, gatewayUrl });
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

  const resolvedMimeType = useQuery({
    queryKey: ["mime-type", resolvedUrl],
    queryFn: () => resolveMimeType(resolvedUrl),
    enabled: !!resolvedUrl && !mimeType,
    initialData: mimeType,
  });

  return {
    mediaInfo: { url: resolvedUrl, mimeType: resolvedMimeType.data },
    isFetched: resolvedMimeType.isFetched,
  };
}

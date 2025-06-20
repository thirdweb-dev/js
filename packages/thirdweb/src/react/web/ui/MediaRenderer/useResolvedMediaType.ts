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
      return resolveArweaveScheme({ gatewayUrl, uri });
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
    enabled: !!resolvedUrl && !mimeType,
    initialData: mimeType,
    queryFn: () => resolveMimeType(resolvedUrl),
    queryKey: ["mime-type", resolvedUrl],
  });

  return {
    isFetched: resolvedMimeType.isFetched || !!mimeType,
    mediaInfo: {
      mimeType: resolvedMimeType.data || "image/",
      url: resolvedUrl, // default to image if no mime type is found
    },
  };
}

/**
 * @internal Exported for tests
 */
export function resolveMediaTypeFromUri(props: {
  uri?: string;
  client: ThirdwebClient;
  gatewayUrl?: string;
}) {
  const { uri, client, gatewayUrl } = props;
  if (!uri) {
    return "";
  }
  if (uri.startsWith("ar://")) {
    return resolveArweaveScheme({ gatewayUrl, uri });
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
}

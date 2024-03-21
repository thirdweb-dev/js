import { useCallback } from "react";
import { track } from "../../../../analytics/track.js";
import type { ThirdwebClient } from "../../../../client/client.js";

/**
 * @internal
 */
export function useTrack(client: ThirdwebClient) {
  return useCallback(
    (data: object) => {
      // never be blocked by tracking - error or otherwise
      setTimeout(() => {
        track(client, data);
      });
    },
    [client],
  );
}

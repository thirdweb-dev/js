import { useCallback } from "react";
import { track } from "../../../../analytics/track.js";
import { useThirdwebProviderProps } from "../../../core/hooks/others/useThirdwebProviderProps.js";

/**
 * @internal
 */
export function useTrack() {
  const { client } = useThirdwebProviderProps();

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

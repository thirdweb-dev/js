import { useCallback } from "react";
import { useThirdwebProviderProps } from "../../hooks/others/useThirdwebProviderProps.js";
import { track } from "../../../analytics/track.js";

/**
 * @internal
 */
export function useTrack() {
  const { client } = useThirdwebProviderProps();

  return useCallback(
    (data: object) => {
      return track(client, data);
    },
    [client],
  );
}

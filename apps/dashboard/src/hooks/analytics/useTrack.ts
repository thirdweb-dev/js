import { useCallback } from "react";

export type TrackingParams = {
  category: string;
  action: string;
  label?: string;
  [key: string]: unknown;
};

export function useTrack() {
  return useCallback((trackingData: TrackingParams) => {
    const { category, action, label, ...restData } = trackingData;
    const catActLab = label
      ? `${category}.${action}.${label}`
      : `${category}.${action}`;
    if (process.env.NODE_ENV !== "production") {
      console.debug(`[PH.capture]:${catActLab}`, restData);
    }

    // TODO: bring back tracking
    console.debug(catActLab, restData);
  }, []);
}

import flat from "flat";
import posthog from "posthog-js";
import { useCallback } from "react";

type TExtendedTrackParams = {
  category: string;
  action: string;
  label?: string;
  [key: string]: any;
};

export function useTrack() {
  return useCallback((trackingData: TExtendedTrackParams) => {
    const { category, action, label, ...restData } = trackingData;
    const catActLab = label
      ? `${category}.${action}.${label}`
      : `${category}.${action}`;
    if (process.env.NODE_ENV === "development") {
      console.debug(`[PH.capture]:${catActLab}`, restData);
    }

    posthog.capture(catActLab, flat(restData));
  }, []);
}

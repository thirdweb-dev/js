import { flatten } from "flat";
import posthog from "posthog-js-opensource";
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

    const restDataSafe = Object.fromEntries(
      Object.entries(restData).map(([key, value]) => {
        if (value instanceof Error) {
          return [
            key,
            { message: value.message, stack: value.stack?.toString() },
          ];
        }
        return [key, value];
      }),
    );

    try {
      posthog.capture(catActLab, flatten(restDataSafe));
    } catch (e) {
      // ignore - we just don't want to trigger an error in the app if posthog fails
    }
  }, []);
}

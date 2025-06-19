import { useCallback } from "react";

export type TrackingParams = {
  category: string;
  action: string;
  label?: string;
  // biome-ignore lint/suspicious/noExplicitAny: FIXME
  [key: string]: any;
};
// TODO: remove this hook entirely
export function useTrack() {
  return useCallback((trackingData: TrackingParams) => {
    const { category, action, label, ...restData } = trackingData;
    const catActLab = label
      ? `${category}.${action}.${label}`
      : `${category}.${action}`;
    if (process.env.NODE_ENV !== "production") {
      console.debug(`[PH.capture]:${catActLab}`, restData);
    }
  }, []);
}

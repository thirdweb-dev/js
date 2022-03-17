import { useCallback } from "react";
import { Options, useTracking } from "react-tracking";

type TExtendedTrackParams = {
  category: string;
  action: string;
  label?: string;
  [key: string]: any;
};

interface IOptions<TOptions extends TExtendedTrackParams>
  extends Options<TOptions> {
  dispatch: (data: TExtendedTrackParams) => any;
}

export function useTrack<TTrackingParams extends {}>(
  params?: TTrackingParams,
  options?: IOptions<any>,
) {
  const { Track, trackEvent } = useTracking(params, options);

  const trackEventWithCategoryActionLabel = useCallback(
    (trackParams: TExtendedTrackParams) => {
      trackEvent(trackParams as any);
    },
    [trackEvent],
  );

  return { Track, trackEvent: trackEventWithCategoryActionLabel };
}

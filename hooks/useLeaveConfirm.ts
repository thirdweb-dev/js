import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { isBrowser } from "utils/isBrowser";

const DEFAULT_MESSAGE =
  "There are unsaved changes. Are you sure you want to leave?";

export function useLeaveConfirm(
  isUnsafeToLeave: boolean,
  message: string = DEFAULT_MESSAGE,
) {
  const Router = useRouter();

  const onRouteChangeStart = useCallback(() => {
    if (isUnsafeToLeave) {
      if (!isBrowser()) {
        // just to make sure we're on the client here first
        return true;
      }
      // eslint-disable-next-line no-alert
      if (window.confirm(message)) {
        return true;
      }
      // eslint-disable-next-line no-throw-literal
      throw "Abort route change by user's confirmation.";
    }
  }, [isUnsafeToLeave, message]);

  useEffect(() => {
    Router.events.on("routeChangeStart", onRouteChangeStart);

    return () => {
      Router.events.off("routeChangeStart", onRouteChangeStart);
    };
  }, [Router.events, onRouteChangeStart]);

  return null;
}

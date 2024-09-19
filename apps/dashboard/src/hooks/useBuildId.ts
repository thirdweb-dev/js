import posthog from "posthog-js";
import { useCallback } from "react";

export const useBuildId = () => {
  const shouldReload = useCallback((): boolean => {
    if (process.env.NODE_ENV !== "production") {
      return false;
    }

    const nextData = document.querySelector("#__NEXT_DATA__");

    const buildId = nextData?.textContent
      ? JSON.parse(nextData.textContent).buildId
      : null;

    const request = new XMLHttpRequest();
    request.open("HEAD", `/_next/static/${buildId}/_buildManifest.js`, false);
    request.setRequestHeader("Pragma", "no-cache");
    request.setRequestHeader("Cache-Control", "no-cache");
    request.setRequestHeader(
      "If-Modified-Since",
      "Thu, 01 Jun 1970 00:00:00 GMT",
    );
    request.send(null);

    if (request.status === 404) {
      posthog.capture("should_reload", {
        buildId,
      });
    }

    return request.status === 404;
  }, []);

  return {
    shouldReload,
  };
};

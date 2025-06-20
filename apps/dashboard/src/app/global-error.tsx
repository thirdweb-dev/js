"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // legitimate usecase
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    Sentry.withScope((scope) => {
      scope.setTag("page-crashed", "true");
      scope.setLevel("fatal");
      Sentry.captureException(error, {
        extra: {
          boundary: "global",
          crashedPage: true,
          router: "app",
        },
      });
    });
  }, [error]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()} type="button">
          Try again
        </button>
      </body>
    </html>
  );
}

"use client";

import { useEffect } from "react";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { stripeRedirectPageChannel } from "@/hooks/stripe/redirect-event";

export default function ClosePage() {
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    stripeRedirectPageChannel.postMessage("close");
    // this will only work if this page is opened as a new tab
    window.close();
  }, []);

  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="flex flex-col items-center text-center text-sm">
        <Spinner className="size-8" />
      </div>
    </div>
  );
}

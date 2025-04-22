"use client";
import { useEffect } from "react";

export const stripeRedirectPageChannel = new BroadcastChannel(
  "stripe-redirect",
);

export function useStripeRedirectEvent(cb?: () => void) {
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (!cb) {
      return;
    }

    function handleMessage(event: MessageEvent) {
      if (!cb) {
        return;
      }

      if (event.data === "close") {
        cb();
      }
    }

    stripeRedirectPageChannel.addEventListener("message", handleMessage);

    return () => {
      stripeRedirectPageChannel.removeEventListener("message", handleMessage);
    };
  }, [cb]);

  return null;
}

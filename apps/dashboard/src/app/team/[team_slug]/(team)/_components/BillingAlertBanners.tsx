"use client";

import { redirectToBillingPortal } from "@/actions/billing";
import {
  PastDueBannerUI,
  ServiceCutOffBannerUI,
} from "./BillingAlertBannersUI";

export function PastDueBanner(props: { teamSlug: string }) {
  return (
    <PastDueBannerUI
      redirectToBillingPortal={redirectToBillingPortal}
      teamSlug={props.teamSlug}
    />
  );
}

export function ServiceCutOffBanner(props: { teamSlug: string }) {
  return (
    <ServiceCutOffBannerUI
      redirectToBillingPortal={redirectToBillingPortal}
      teamSlug={props.teamSlug}
    />
  );
}

"use client";

import { getBillingPortalUrl } from "@/actions/billing";
import {
  PastDueBannerUI,
  ServiceCutOffBannerUI,
} from "./BillingAlertBannersUI";

export function PastDueBanner(props: { teamSlug: string }) {
  return (
    <PastDueBannerUI
      getBillingPortalUrl={getBillingPortalUrl}
      teamSlug={props.teamSlug}
    />
  );
}

export function ServiceCutOffBanner(props: { teamSlug: string }) {
  return (
    <ServiceCutOffBannerUI
      getBillingPortalUrl={getBillingPortalUrl}
      teamSlug={props.teamSlug}
    />
  );
}

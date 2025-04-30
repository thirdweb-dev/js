"use client";
import {
  PastDueBannerUI,
  ServiceCutOffBannerUI,
} from "./BillingAlertBannersUI";

export function PastDueBanner(props: { teamSlug: string }) {
  return <PastDueBannerUI teamSlug={props.teamSlug} />;
}

export function ServiceCutOffBanner(props: { teamSlug: string }) {
  return <ServiceCutOffBannerUI teamSlug={props.teamSlug} />;
}

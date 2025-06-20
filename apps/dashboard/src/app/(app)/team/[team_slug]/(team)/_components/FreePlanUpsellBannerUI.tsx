"use client";

import { ArrowRightIcon, RocketIcon } from "lucide-react";
import type { Team } from "@/api/team";
import { UpsellBannerCard } from "@/components/blocks/UpsellBannerCard";

/**
 * Banner shown to teams on the free plan encouraging them to upgrade.
 * It links to the team's billing settings page and automatically opens
 * the pricing modal via the `showPlans=true` query param.
 */
export function FreePlanUpsellBannerUI(props: {
  teamSlug: string;
  highlightPlan: Team["billingPlan"];
}) {
  return (
    <UpsellBannerCard
      accentColor="green"
      cta={{
        icon: <ArrowRightIcon className="size-4" />,
        link: `/team/${props.teamSlug}/~/settings/billing?showPlans=true&highlight=${
          props.highlightPlan || "growth"
        }`,
        text: "View plans",
      }}
      description="Upgrade to increase limits and access advanced features."
      icon={<RocketIcon className="size-5" />}
      title="Unlock more with thirdweb"
      trackingCategory="billingBanner"
      trackingLabel="freePlan_viewPlans"
    />
  );
}

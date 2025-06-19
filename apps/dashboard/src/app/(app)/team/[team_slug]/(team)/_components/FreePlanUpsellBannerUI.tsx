"use client";

import type { Team } from "@/api/team";
import { UpsellBannerCard } from "@/components/blocks/UpsellBannerCard";
import { ArrowRightIcon, RocketIcon } from "lucide-react";

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
      title="Unlock more with thirdweb"
      description="Upgrade to increase limits and access advanced features."
      cta={{
        text: "View plans",
        icon: <ArrowRightIcon className="size-4" />,
        link: `/team/${props.teamSlug}/~/settings/billing?showPlans=true&highlight=${
          props.highlightPlan || "growth"
        }`,
      }}
      icon={<RocketIcon className="size-5" />}
      accentColor="green"
    />
  );
}

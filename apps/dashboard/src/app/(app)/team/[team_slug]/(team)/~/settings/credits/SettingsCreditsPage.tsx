"use client";

import { ApplyForOpCredits } from "@app/team/[team_slug]/(team)/~/settings/credits/components/ApplyForOpCreditsModal";
import type { Team } from "@/api/team";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import type { Account } from "@/hooks/useApi";

export const SettingsGasCreditsPage = (props: {
  team: Team;
  account: Account;
}) => {
  return (
    <div>
      <div className="flex flex-row items-center justify-between gap-4">
        <div>
          <h2 className="mb-0.5 font-semibold text-2xl tracking-tight">
            Credits
          </h2>
          <p className="text-muted-foreground text-sm">
            Apply to the Optimism Superchain App Accelerator.{" "}
            <UnderlineLink
              href="https://blog.thirdweb.com/accelerating-the-superchain-with-optimism/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Learn More
            </UnderlineLink>
          </p>
        </div>
      </div>
      <div className="h-6" />
      <ApplyForOpCredits account={props.account} team={props.team} />
    </div>
  );
};

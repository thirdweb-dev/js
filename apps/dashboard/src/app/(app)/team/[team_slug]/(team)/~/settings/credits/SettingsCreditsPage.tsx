"use client";

import type { Team } from "@/api/team";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { ApplyForOpCredits } from "components/onboarding/ApplyForOpCreditsModal";

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
              target="_blank"
              rel="noopener noreferrer"
              href="https://blog.thirdweb.com/accelerating-the-superchain-with-optimism/"
            >
              Learn More
            </UnderlineLink>
          </p>
        </div>
      </div>
      <div className="h-6" />
      <ApplyForOpCredits team={props.team} account={props.account} />
    </div>
  );
};

"use client";
import type { Team } from "@/api/team";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { ApplyForOpCredits } from "components/onboarding/ApplyForOpCreditsModal";
import { Heading, LinkButton } from "tw-components";

export const SettingsGasCreditsPage = (props: {
  team: Team;
  account: Account;
}) => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-row items-center gap-4">
        <Heading size="title.lg" as="h1">
          Apply to the Optimism Superchain App Accelerator
        </Heading>
        <LinkButton
          display={{ base: "none", md: "inherit" }}
          isExternal
          href="https://blog.thirdweb.com/accelerating-the-superchain-with-optimism/"
          size="sm"
          variant="outline"
        >
          Learn More
        </LinkButton>
      </div>

      <ApplyForOpCredits team={props.team} account={props.account} />
    </div>
  );
};

import type { Team } from "@/api/team";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { type Account, accountPlan } from "@3rdweb-sdk/react/hooks/useApi";
import { useLocalStorage } from "hooks/useLocalStorage";
import { ArrowRightIcon, CircleAlertIcon } from "lucide-react";
import { useState } from "react";
import { TeamPlanBadge } from "../../app/(app)/components/TeamPlanBadge";
import { getValidTeamPlan } from "../../app/(app)/team/components/TeamHeader/getValidTeamPlan";
import { ApplyForOpCreditsForm } from "./ApplyForOpCreditsForm";
import { PlanCard } from "./PlanCard";

export type CreditsRecord = {
  plan: Team["billingPlan"];
  upTo?: true;
  credits: string;
  features?: string[];
};

const tier2Credits: Omit<CreditsRecord, "plan"> = {
  upTo: true,
  credits: "$2,500",
  features: [
    "10k monthly active wallets",
    "User analytics",
    "Custom Auth",
    "Custom Branding",
  ],
};

const tier1Credits: Omit<CreditsRecord, "plan"> = {
  upTo: true,
  credits: "$250",
};

export const PlanToCreditsRecord: Record<Team["billingPlan"], CreditsRecord> = {
  free: {
    plan: "free",
    ...tier1Credits,
  },
  starter: {
    plan: "starter",
    ...tier1Credits,
  },

  growth: {
    plan: "growth",
    ...tier1Credits,
  },
  growth_legacy: {
    plan: "growth_legacy",
    ...tier2Credits,
  },
  accelerate: {
    plan: "accelerate",
    ...tier2Credits,
  },
  scale: {
    plan: "scale",
    ...tier2Credits,
  },
  pro: {
    plan: "pro",
    upTo: true,
    credits: "$3,000+",
    features: [
      "Custom rate limits for APIs & Infra",
      "Enterprise grade SLAs",
      "Dedicated support",
    ],
  },
};

export function ApplyForOpCredits(props: {
  team: Team;
  account: Account;
}) {
  const { account, team } = props;
  const validTeamPlan = getValidTeamPlan(team);
  const hasValidPaymentMethod = validTeamPlan !== "free";

  const [hasAppliedForOpGrant] = useLocalStorage(
    `appliedForOpGrant-${team.id}`,
    false,
  );

  const isStarterPlan = validTeamPlan === "starter";
  const isProPlan = validTeamPlan === "pro";
  const creditsRecord = PlanToCreditsRecord[validTeamPlan];

  return (
    <div>
      <div>
        {/* credits info */}
        <div className="rounded-lg border bg-card">
          <div className="relative flex justify-between px-6 py-4">
            <h2 className="font-semibold text-lg capitalize tracking-tight">
              {creditsRecord.upTo && "Up to"} {creditsRecord.credits} Gas
              Credits
            </h2>
            <TeamPlanBadge
              className="absolute top-5 right-6"
              plan={creditsRecord.plan}
              teamSlug={team.slug}
            />
          </div>

          {/* alert */}
          {!hasValidPaymentMethod && (
            <div className="px-6 pb-6">
              <Alert variant="warning" className="bg-background">
                <CircleAlertIcon className="size-5" />
                <AlertTitle>Payment method required</AlertTitle>
                <AlertDescription>
                  You need to add a payment method to be able to claim credits.{" "}
                  <br /> This is to prevent abuse, you will not be charged.{" "}
                  <UnderlineLink
                    href={`/team/${props.team.slug}/~/settings/billing`}
                  >
                    Upgrade plan to get started
                  </UnderlineLink>
                  .
                </AlertDescription>
              </Alert>
            </div>
          )}

          <div className="flex justify-end border-t p-4">
            <ApplyOpCreditsButton
              hasAppliedForOpGrant={hasAppliedForOpGrant}
              hasValidPaymentMethod={hasValidPaymentMethod}
              validTeamPlan={validTeamPlan}
              account={account}
            />
          </div>
        </div>

        {!isProPlan && (
          <div>
            <p className="my-6 text-center text-muted-foreground text-sm tracking-wide">
              Or upgrade and get access to more credits
            </p>
            <div className="flex flex-col gap-6">
              {isStarterPlan && (
                <PlanCard
                  creditsRecord={PlanToCreditsRecord[accountPlan.growth]}
                  teamSlug={team.slug}
                />
              )}
              <PlanCard
                creditsRecord={PlanToCreditsRecord[accountPlan.pro]}
                teamSlug={team.slug}
              />
            </div>
          </div>
        )}
      </div>
      <p className="mt-6 text-center text-muted-foreground text-sm">
        We are open to distributing more than the upper limit for each tier if
        you make a strong case about how it will be utilized.
      </p>
    </div>
  );
}

function ApplyOpCreditsButton(props: {
  hasAppliedForOpGrant: boolean;
  hasValidPaymentMethod: boolean;
  validTeamPlan: Team["billingPlan"];
  account: Account;
}) {
  const {
    hasAppliedForOpGrant,
    hasValidPaymentMethod,
    validTeamPlan,
    account,
  } = props;

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          disabled={!hasValidPaymentMethod || hasAppliedForOpGrant}
          className="gap-2"
          size="sm"
        >
          {hasAppliedForOpGrant ? (
            "Already applied"
          ) : (
            <>
              Apply Now
              <ArrowRightIcon className="size-4" />
            </>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="!max-w-2xl overflow-auto">
        <SheetHeader>
          <SheetTitle>Apply for OP credits</SheetTitle>
        </SheetHeader>
        <div className="h-5" />
        <ApplyForOpCreditsForm
          onClose={() => {
            setIsOpen(false);
          }}
          plan={validTeamPlan}
          account={account}
        />
      </SheetContent>
    </Sheet>
  );
}

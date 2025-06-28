import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import type { Team } from "@/api/team";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { planToTierRecordForGating } from "@/constants/planToTierRecord";
import { cn } from "@/lib/utils";
import { getTeamPlanBadgeLabel, TeamPlanBadge } from "./TeamPlanBadge";

type SwitchProps = React.ComponentProps<typeof Switch>;

type GatedSwitchProps = {
  trackingLabel?: string;
  currentPlan: Team["billingPlan"];
  requiredPlan: Team["billingPlan"];
  teamSlug: string;
  switchProps?: SwitchProps;
};

export const GatedSwitch: React.FC<GatedSwitchProps> = (
  props: GatedSwitchProps,
) => {
  const isUpgradeRequired =
    planToTierRecordForGating[props.currentPlan] <
    planToTierRecordForGating[props.requiredPlan];

  return (
    <ToolTipLabel
      hoverable
      label={
        isUpgradeRequired ? (
          <div className="w-full min-w-[280px]">
            <h3 className="font-medium text-base">
              <span className="capitalize">
                {getTeamPlanBadgeLabel(props.requiredPlan)}+
              </span>{" "}
              plan required
            </h3>
            <p className="mb-3.5 text-muted-foreground">
              Upgrade your plan to use this feature
            </p>

            <div className="flex w-full flex-col gap-2">
              <Button asChild className="justify-start gap-2" size="sm">
                <Link
                  href={`/team/${props.teamSlug}/~/billing?showPlans=true&highlight=${props.requiredPlan}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Upgrade to {getTeamPlanBadgeLabel(props.requiredPlan)} plan
                  <ExternalLinkIcon className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        ) : undefined
      }
    >
      <div className="inline-flex items-center gap-2">
        {isUpgradeRequired && (
          <TeamPlanBadge
            plan={props.requiredPlan}
            postfix="+"
            teamSlug={props.teamSlug}
          />
        )}
        <Switch
          {...props.switchProps}
          checked={props.switchProps?.checked && !isUpgradeRequired}
          className={cn("disabled:opacity-100", props.switchProps?.className)}
          disabled={props.switchProps?.disabled || isUpgradeRequired}
        />
      </div>
    </ToolTipLabel>
  );
};

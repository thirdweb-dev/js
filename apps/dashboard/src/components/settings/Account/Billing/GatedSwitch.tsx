import type { Team } from "@/api/team";
import { Switch } from "@/components/ui/switch";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import { cn } from "@/lib/utils";
import { TeamPlanBadge } from "../../../../app/(app)/components/TeamPlanBadge";
import { planToTierRecordForGating } from "./planToTierRecord";

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
      contentClassName="max-w-[300px]"
      label={
        isUpgradeRequired ? (
          <span>
            To access this feature, <br /> Upgrade to the{" "}
            <TrackedLinkTW
              target="_blank"
              href={`/team/${props.teamSlug}/~/settings/billing`}
              category="advancedFeature"
              label={props.trackingLabel}
              className="text-link-foreground capitalize hover:text-foreground"
            >
              {props.requiredPlan} plan
            </TrackedLinkTW>
          </span>
        ) : undefined
      }
    >
      <div className="inline-flex items-center gap-2">
        {isUpgradeRequired && <TeamPlanBadge plan={props.requiredPlan} />}
        <Switch
          {...props.switchProps}
          checked={props.switchProps?.checked && !isUpgradeRequired}
          disabled={props.switchProps?.disabled || isUpgradeRequired}
          className={cn("disabled:opacity-100", props.switchProps?.className)}
        />
      </div>
    </ToolTipLabel>
  );
};

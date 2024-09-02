import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { TrackedLinkTW } from "@/components/ui/tracked-link";

type SwitchProps = React.ComponentProps<typeof Switch>;

interface GatedSwitchProps extends SwitchProps {
  trackingLabel?: string;
  upgradeRequired: boolean;
}

export const GatedSwitch: React.FC<GatedSwitchProps> = (
  allProps: GatedSwitchProps,
) => {
  const { upgradeRequired, trackingLabel, checked, ...props } = allProps;

  return (
    <ToolTipLabel
      hoverable
      label={
        upgradeRequired ? (
          <div className="w-[220px]">
            To access this feature, you need to upgrade to the{" "}
            <TrackedLinkTW
              target="_blank"
              href={"/dashboard/settings/billing"}
              category="advancedFeature"
              label={trackingLabel}
              className="text-link-foreground hover:text-foreground"
            >
              Growth plan
            </TrackedLinkTW>
            .
          </div>
        ) : undefined
      }
    >
      <div className="inline-flex gap-2 items-center">
        {upgradeRequired && <Badge>Growth</Badge>}
        <Switch
          checked={checked}
          disabled={upgradeRequired || props.disabled}
          {...props}
        />
      </div>
    </ToolTipLabel>
  );
};

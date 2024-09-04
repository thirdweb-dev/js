import type { Meta, StoryObj } from "@storybook/react";
import { Separator } from "../../../../@/components/ui/separator";
import { BadgeContainer } from "../../../../stories/utils";
import { GatedSwitch } from "./GatedSwitch";

const meta = {
  title: "Billing/GatedSwitch",
  component: Variants,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Variants>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  args: {
    theme: "dark",
  },
};

function Variants() {
  return (
    <div className="bg-background p-7 min-h-screen text-foreground">
      <div className="flex flex-col gap-8 max-w-[500px] mx-auto">
        <BadgeContainer label="upgradeRequired">
          <GatedSwitch upgradeRequired />
        </BadgeContainer>

        <BadgeContainer label="No upgradeRequired">
          <GatedSwitch upgradeRequired={false} />
        </BadgeContainer>

        <BadgeContainer label="No upgradeRequired, disabled">
          <GatedSwitch upgradeRequired={false} disabled />
        </BadgeContainer>

        <Separator />

        <BadgeContainer label="upgradeRequired, Checked">
          <GatedSwitch upgradeRequired checked />
        </BadgeContainer>

        <BadgeContainer label="upgradeRequired, unchecked">
          <GatedSwitch upgradeRequired checked={false} />
        </BadgeContainer>

        <Separator />

        <BadgeContainer label="No upgradeRequired, Checked">
          <GatedSwitch upgradeRequired={false} checked />
        </BadgeContainer>

        <BadgeContainer label="No upgradeRequired, unchecked">
          <GatedSwitch upgradeRequired={false} checked={false} />
        </BadgeContainer>
      </div>
    </div>
  );
}

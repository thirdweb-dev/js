import { Separator } from "@/components/ui/separator";
import type { Meta, StoryObj } from "@storybook/react";
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
    <div className="min-h-dvh bg-background p-7 text-foreground">
      <div className="mx-auto flex max-w-[500px] flex-col gap-8">
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

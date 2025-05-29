import type { Team } from "@/api/team";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { BadgeContainer } from "../../../../stories/utils";
import { GatedSwitch } from "./GatedSwitch";

const meta = {
  title: "Billing/GatedSwitch",
  component: Variants,
} satisfies Meta<typeof Variants>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  args: {
    theme: "dark",
  },
};

function Variants() {
  const [requiredPlan, setRequiredPlan] = useState<
    "free" | "growth" | "scale" | "pro"
  >("scale");

  const plans: Team["billingPlan"][] = [
    "free",
    "starter_legacy",
    "starter",
    "growth_legacy",
    "growth",
    "accelerate",
    "scale",
    "pro",
  ];

  return (
    <div className="container flex max-w-5xl flex-col gap-10 py-10">
      <div className="flex items-center gap-2">
        <Label>Required Plan</Label>
        <Select
          value={requiredPlan}
          onValueChange={(value) =>
            setRequiredPlan(value as typeof requiredPlan)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="growth">Growth</SelectItem>
            <SelectItem value="scale">Scale</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {plans.map((currentPlan) => (
        <BadgeContainer key={currentPlan} label={`plan: ${currentPlan}`}>
          <GatedSwitch
            key={currentPlan}
            currentPlan={currentPlan}
            requiredPlan={requiredPlan}
            teamSlug="foo"
          />
        </BadgeContainer>
      ))}
    </div>
  );
}

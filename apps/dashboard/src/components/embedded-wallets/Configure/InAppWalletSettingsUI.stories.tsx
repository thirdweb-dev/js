import type { Team } from "@/api/team";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { projectStub } from "../../../stories/stubs";
import { storybookThirdwebClient } from "../../../stories/utils";
import { InAppWalletSettingsUI } from "./index";

const meta = {
  title: "settings/in-app-wallet",
  component: Variants,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof Variants>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FreePlan: Story = {
  args: {
    currentPlan: "free",
  },
};

export const GrowthPlan: Story = {
  args: {
    currentPlan: "growth",
  },
};

export const AcceleratePlan: Story = {
  args: {
    currentPlan: "accelerate",
  },
};

export const GrowthLegacyPlan: Story = {
  args: {
    currentPlan: "growth_legacy",
  },
};

export const ProPlan: Story = {
  args: {
    currentPlan: "pro",
  },
};

function Variants(props: {
  currentPlan: Team["billingPlan"];
}) {
  return (
    <div className="mx-auto w-full max-w-[1140px] px-4 py-6">
      <div className="flex flex-col gap-10">
        <InAppWalletSettingsUI
          teamPlan={props.currentPlan}
          client={storybookThirdwebClient}
          project={projectStub("foo", "bar")}
          teamId="bar"
          embeddedWalletService={{
            actions: [],
            name: "embeddedWallets",
          }}
          teamSlug="bar"
          isUpdating={false}
          trackingCategory="foo"
          updateApiKey={() => {}}
          smsCountryTiers={{
            // scaffold some countries to play around with the UI
            tier1: ["US", "CA"],
            tier2: ["GB", "AU", "NZ"],
            tier3: ["FR", "DE", "ES", "IT"],
            tier4: ["JP", "KR", "MX", "RU"],
            tier5: ["BR", "AR", "CO", "CL", "PE", "VE", "SA"],
          }}
        />
      </div>
    </div>
  );
}

import type { Meta, StoryObj } from "@storybook/react";
import { projectStub } from "../../../stories/stubs";
import { mobileViewport } from "../../../stories/utils";
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

export const GrowthPlan: Story = {
  args: {
    canEditAdvancedFeatures: true,
  },
};

export const FreePlan: Story = {
  args: {
    canEditAdvancedFeatures: false,
  },
};

export const GrowthPlanMobile: Story = {
  args: {
    canEditAdvancedFeatures: true,
  },
  parameters: {
    viewport: mobileViewport("iphone14"),
  },
};

export const FreePlanMobile: Story = {
  args: {
    canEditAdvancedFeatures: false,
  },
  parameters: {
    viewport: mobileViewport("iphone14"),
  },
};

function Variants(props: {
  canEditAdvancedFeatures: boolean;
}) {
  return (
    <div className="mx-auto w-full max-w-[1140px] px-4 py-6">
      <div className="flex flex-col gap-10">
        <InAppWalletSettingsUI
          canEditAdvancedFeatures={props.canEditAdvancedFeatures}
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

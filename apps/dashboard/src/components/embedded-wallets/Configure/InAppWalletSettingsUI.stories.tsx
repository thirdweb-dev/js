import type { Meta, StoryObj } from "@storybook/react";
import { createApiKeyStub } from "../../../stories/stubs";
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

const apiKeyStub = createApiKeyStub();

function Variants(props: {
  canEditAdvancedFeatures: boolean;
}) {
  return (
    <div className="py-6 max-w-[1140px] mx-auto w-full px-4">
      <div className="flex gap-10 flex-col">
        <InAppWalletSettingsUI
          canEditAdvancedFeatures={props.canEditAdvancedFeatures}
          apiKey={apiKeyStub}
          isUpdating={false}
          trackingCategory="foo"
          updateApiKey={() => {}}
        />
      </div>
    </div>
  );
}

import type { Meta, StoryObj } from "@storybook/react";
import { accountStub, createApiKeyStub } from "../../../stories/stubs";
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
    <div className="mx-auto w-full max-w-[1140px] px-4 py-6">
      <div className="flex flex-col gap-10">
        <InAppWalletSettingsUI
          canEditAdvancedFeatures={props.canEditAdvancedFeatures}
          apiKey={apiKeyStub}
          isUpdating={false}
          trackingCategory="foo"
          updateApiKey={() => {}}
          twAccount={accountStub()}
        />
      </div>
    </div>
  );
}

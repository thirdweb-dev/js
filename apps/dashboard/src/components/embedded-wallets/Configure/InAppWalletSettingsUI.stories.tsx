import type { ApiKey, ApiKeyService } from "@3rdweb-sdk/react/hooks/useApi";
import type { Meta, StoryObj } from "@storybook/react";
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

const embeddedWalletService: ApiKeyService = {
  id: "embeddedWallets",
  name: "embeddedWallets", // important
  targetAddresses: [],
  actions: [],
};

const apiKeyStub: ApiKey = {
  id: "api-key-id-foo",
  name: "api key name foo",
  key: "key-foobar",
  accountId: "account-id-foo",
  bundleIds: ["bundle-id-foo", "bundle-id-bar"],
  createdAt: new Date().toISOString(),
  creatorWalletAddress: "0x1F846F6DAE38E1C88D71EAA191760B15f38B7A37",
  domains: ["example1.com", "example2.com"],
  secretMasked: "",
  walletAddresses: ["0x1F846F6DAE38E1C88D71EAA191760B15f38B7A37"],
  redirectUrls: [],
  revokedAt: "",
  lastAccessedAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  services: [embeddedWalletService],
};

function Variants(props: {
  canEditAdvancedFeatures: boolean;
}) {
  return (
    <div className="min-h-screen bg-background p-6 text-foreground max-w-[1140px] mx-auto">
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

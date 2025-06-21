import type { Meta, StoryObj } from "@storybook/nextjs";
import {
  PastDueBannerUI,
  ServiceCutOffBannerUI,
} from "./BillingAlertBannersUI";

const meta = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  title: "Banners/Billing Alerts",
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const PaymentAlerts: Story = {
  render: () => (
    <div className="space-y-10">
      <PastDueBannerUI teamSlug="foo" />

      <ServiceCutOffBannerUI teamSlug="foo" />
    </div>
  ),
};

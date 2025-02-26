import type { Meta, StoryObj } from "@storybook/react";
import { teamStub } from "../../../../stories/stubs";
import { BadgeContainer, mobileViewport } from "../../../../stories/utils";
import { BillingPricing } from "./Pricing";

const meta = {
  title: "Billing/PricingCards",
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof Story>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  args: {},
};

export const Mobile: Story = {
  args: {},
  parameters: {
    viewport: mobileViewport("iphone14"),
  },
};

function Story() {
  const getBillingPortalUrlStub = async () => ({
    status: 200,
    url: "https://example.com",
  });

  return (
    <div className="container flex max-w-[1132px] flex-col gap-12 py-10">
      <BadgeContainer label="Free">
        <BillingPricing
          team={teamStub("foo", "free")}
          trialPeriodEndedAt={undefined}
          getBillingCheckoutUrl={getBillingPortalUrlStub}
        />
      </BadgeContainer>

      <BadgeContainer label="Starter">
        <BillingPricing
          team={teamStub("foo", "starter")}
          trialPeriodEndedAt={undefined}
          getBillingCheckoutUrl={getBillingPortalUrlStub}
        />
      </BadgeContainer>

      <BadgeContainer label="Growth">
        <BillingPricing
          team={teamStub("foo", "growth")}
          trialPeriodEndedAt={undefined}
          getBillingCheckoutUrl={getBillingPortalUrlStub}
        />
      </BadgeContainer>

      <BadgeContainer label="Pro">
        <BillingPricing
          team={teamStub("foo", "pro")}
          trialPeriodEndedAt={undefined}
          getBillingCheckoutUrl={getBillingPortalUrlStub}
        />
      </BadgeContainer>
    </div>
  );
}

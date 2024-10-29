import type { Meta, StoryObj } from "@storybook/react";
import { ThirdwebProvider } from "thirdweb/react";
import { AccountStatus } from "../../../../../@3rdweb-sdk/react/hooks/useApi";
import {
  createBillableServiceUsageDataStub,
  createDashboardAccountStub,
} from "../../../../../stories/stubs";
import { BadgeContainer, mobileViewport } from "../../../../../stories/utils";
import { BillingAlertsUI } from "./Alert";

const meta = {
  title: "blocks/BillingAlerts",
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

function yesterday(d: Date) {
  return new Date(d.getTime() - 24 * 60 * 60 * 1000);
}

function tomorrow(d: Date) {
  return new Date(d.getTime() + 24 * 60 * 60 * 1000);
}

function Story() {
  return (
    <ThirdwebProvider>
      <div className="container flex max-w-[1100px] flex-col gap-10 py-10">
        <BadgeContainer label="#usage">
          <BillingAlertsUI
            dashboardAccount={createDashboardAccountStub("foo")}
            usageData={createBillableServiceUsageDataStub()}
          />
        </BadgeContainer>

        <BadgeContainer label="#paymentVerification">
          <BillingAlertsUI
            dashboardAccount={createDashboardAccountStub("foo", {
              status: AccountStatus.PaymentVerification,
              stripePaymentActionUrl: "https://example.com",
            })}
            usageData={createBillableServiceUsageDataStub({
              limits: {
                embeddedWallets: 100,
                storage: 100,
              },
            })}
          />
        </BadgeContainer>

        <BadgeContainer label="#serviceCutoff">
          <BillingAlertsUI
            dashboardAccount={createDashboardAccountStub("foo", {
              recurringPaymentFailures: [
                {
                  subscriptionId: "s1",
                  subscriptionDescription: "s1 desc",
                  paymentFailureCode: "400",
                  serviceCutoffDate: yesterday(new Date()).toISOString(),
                },
              ],
            })}
            usageData={createBillableServiceUsageDataStub({
              limits: {
                embeddedWallets: 100,
                storage: 100,
              },
            })}
          />
        </BadgeContainer>

        <BadgeContainer label="#recurringPayment">
          <BillingAlertsUI
            dashboardAccount={createDashboardAccountStub("foo", {
              recurringPaymentFailures: [
                {
                  subscriptionId: "s1",
                  subscriptionDescription: "s1 desc",
                  paymentFailureCode: "400",
                  serviceCutoffDate: tomorrow(new Date()).toISOString(),
                },
              ],
            })}
            usageData={createBillableServiceUsageDataStub({
              limits: {
                embeddedWallets: 100,
                storage: 100,
              },
            })}
          />
        </BadgeContainer>

        <BadgeContainer label="usage + serviceCutoff">
          <BillingAlertsUI
            dashboardAccount={createDashboardAccountStub("foo", {
              recurringPaymentFailures: [
                {
                  subscriptionId: "s1",
                  subscriptionDescription: "s1 desc",
                  paymentFailureCode: "400",
                  serviceCutoffDate: yesterday(new Date()).toISOString(),
                },
              ],
            })}
            usageData={createBillableServiceUsageDataStub()}
          />
        </BadgeContainer>
      </div>
    </ThirdwebProvider>
  );
}

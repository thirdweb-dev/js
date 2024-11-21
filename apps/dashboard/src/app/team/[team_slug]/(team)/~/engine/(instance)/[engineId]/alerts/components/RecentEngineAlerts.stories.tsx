import type { Meta, StoryObj } from "@storybook/react";
import { Toaster } from "sonner";
import {
  createEngineAlertRuleStub,
  createEngineAlertStub,
} from "stories/stubs";
import { BadgeContainer, mobileViewport } from "stories/utils";
import { RecentEngineAlertsSectionUI } from "./RecentEngineAlerts";

const meta = {
  title: "Engine/Alerts/Recent Alerts",
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
  return (
    <div className="container flex max-w-[1154px] flex-col gap-14 py-6">
      <BadgeContainer label="3 Alerts">
        <RecentEngineAlertsSectionUI
          isLoading={false}
          onAlertsUpdated={() => {}}
          alertRules={[createEngineAlertRuleStub("foo")]}
          alerts={[
            createEngineAlertStub("foo"),
            createEngineAlertStub("foo", {
              status: "firing",
            }),
            createEngineAlertStub("foo", {
              status: "resolved",
            }),
          ]}
        />
      </BadgeContainer>

      <BadgeContainer label="No Alerts">
        <RecentEngineAlertsSectionUI
          isLoading={false}
          alertRules={[]}
          alerts={[]}
          onAlertsUpdated={() => {}}
        />
      </BadgeContainer>

      <BadgeContainer label="Loading">
        <RecentEngineAlertsSectionUI
          isLoading={true}
          alertRules={[]}
          alerts={[]}
          onAlertsUpdated={() => {}}
        />
      </BadgeContainer>

      <Toaster richColors />
    </div>
  );
}

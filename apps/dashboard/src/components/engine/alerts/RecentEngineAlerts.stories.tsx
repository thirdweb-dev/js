import type { Meta, StoryObj } from "@storybook/react";
import { Toaster } from "sonner";
import {
  createEngineAlertRuleStub,
  createEngineAlertStub,
} from "../../../stories/stubs";
import { BadgeContainer, mobileViewport } from "../../../stories/utils";
import { RecentEngineAlertsSectionUI } from "./RecentEngineAlerts";

const meta = {
  title: "engine/alerts/recent",
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
    <div className="py-6 container max-w-[1154px] flex flex-col gap-14">
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

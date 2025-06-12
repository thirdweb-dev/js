import type { Meta, StoryObj } from "@storybook/nextjs";
import {
  createEngineAlertRuleStub,
  createEngineAlertStub,
} from "stories/stubs";
import { BadgeContainer } from "stories/utils";
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

export const Variants: Story = {
  args: {},
};

function Story() {
  return (
    <div className="container flex max-w-6xl flex-col gap-14 py-10">
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
    </div>
  );
}

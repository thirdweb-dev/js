import type { Meta, StoryObj } from "@storybook/nextjs";
import {
  createEngineAlertRuleStub,
  createEngineAlertStub,
} from "@/storybook/stubs/engine";
import { BadgeContainer } from "@/storybook/utils";
import { RecentEngineAlertsSectionUI } from "./RecentEngineAlerts";

const meta = {
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  title: "Engine/Alerts/Recent Alerts",
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
          isLoading={false}
          onAlertsUpdated={() => {}}
        />
      </BadgeContainer>

      <BadgeContainer label="No Alerts">
        <RecentEngineAlertsSectionUI
          alertRules={[]}
          alerts={[]}
          isLoading={false}
          onAlertsUpdated={() => {}}
        />
      </BadgeContainer>

      <BadgeContainer label="Loading">
        <RecentEngineAlertsSectionUI
          alertRules={[]}
          alerts={[]}
          isLoading={true}
          onAlertsUpdated={() => {}}
        />
      </BadgeContainer>
    </div>
  );
}

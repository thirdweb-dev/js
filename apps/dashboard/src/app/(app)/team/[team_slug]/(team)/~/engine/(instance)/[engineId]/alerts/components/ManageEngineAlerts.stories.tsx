import type {
  CreateNotificationChannelInput,
  EngineNotificationChannel,
} from "@3rdweb-sdk/react/hooks/useEngine";
import type { Meta, StoryObj } from "@storybook/react";
import { useMutation } from "@tanstack/react-query";
import {
  createEngineAlertRuleStub,
  createEngineNotificationChannelStub,
} from "stories/stubs";
import { BadgeContainer } from "stories/utils";
import { ManageEngineAlertsSectionUI } from "./ManageEngineAlerts";

const meta = {
  title: "Engine/Alerts/ManageAlerts",
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
  const createEngineAlertMutation = useMutation({
    mutationFn: async (values: CreateNotificationChannelInput) => {
      console.log("creating alert using input:", values);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const channelStub: EngineNotificationChannel = {
        createdAt: new Date(),
        id: "new-channel",
        pausedAt: null,
        subscriptionRoutes: values.subscriptionRoutes,
        value: values.value,
        type: values.type,
      };

      console.log("created channel:", channelStub);
      return channelStub;
    },
  });

  async function deleteAlert(alertId: string) {
    console.log("deleting alert:", alertId);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return (
    <div className="container flex max-w-6xl flex-col gap-14 py-6">
      <BadgeContainer label="2 Alerts">
        <ManageEngineAlertsSectionUI
          isLoading={false}
          onAlertsUpdated={() => {}}
          engineId="test-engine-id"
          createAlertMutation={createEngineAlertMutation}
          deleteAlert={deleteAlert}
          alertRules={[
            createEngineAlertRuleStub("foo"),
            createEngineAlertRuleStub("bar"),
          ]}
          notificationChannels={[
            createEngineNotificationChannelStub("foo"),
            createEngineNotificationChannelStub("foo", {
              pausedAt: null,
            }),
          ]}
        />
      </BadgeContainer>

      <BadgeContainer label="No Alerts">
        <ManageEngineAlertsSectionUI
          alertRules={[
            createEngineAlertRuleStub("foo"),
            createEngineAlertRuleStub("bar"),
          ]}
          engineId="test-engine-id"
          notificationChannels={[]}
          isLoading={false}
          onAlertsUpdated={() => {}}
          createAlertMutation={createEngineAlertMutation}
          deleteAlert={deleteAlert}
        />
      </BadgeContainer>

      <BadgeContainer label="Loading">
        <ManageEngineAlertsSectionUI
          alertRules={[
            createEngineAlertRuleStub("foo"),
            createEngineAlertRuleStub("bar"),
          ]}
          engineId="test-engine-id"
          notificationChannels={[]}
          isLoading={true}
          onAlertsUpdated={() => {}}
          createAlertMutation={createEngineAlertMutation}
          deleteAlert={deleteAlert}
        />
      </BadgeContainer>

      <BadgeContainer label="No Alert Rules">
        <ManageEngineAlertsSectionUI
          alertRules={[]}
          engineId="test-engine-id"
          notificationChannels={[]}
          isLoading={false}
          onAlertsUpdated={() => {}}
          createAlertMutation={createEngineAlertMutation}
          deleteAlert={deleteAlert}
        />
      </BadgeContainer>
    </div>
  );
}

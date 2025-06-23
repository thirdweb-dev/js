import type { Meta, StoryObj } from "@storybook/nextjs";
import { useMutation } from "@tanstack/react-query";
import type {
  CreateNotificationChannelInput,
  EngineNotificationChannel,
} from "@/hooks/useEngine";
import {
  createEngineAlertRuleStub,
  createEngineNotificationChannelStub,
} from "@/storybook/stubs/engine";
import { BadgeContainer } from "@/storybook/utils";
import { ManageEngineAlertsSectionUI } from "./ManageEngineAlerts";

const meta = {
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  title: "Engine/Alerts/ManageAlerts",
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
        type: values.type,
        value: values.value,
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
          alertRules={[
            createEngineAlertRuleStub("foo"),
            createEngineAlertRuleStub("bar"),
          ]}
          createAlertMutation={createEngineAlertMutation}
          deleteAlert={deleteAlert}
          engineId="test-engine-id"
          isLoading={false}
          notificationChannels={[
            createEngineNotificationChannelStub("foo"),
            createEngineNotificationChannelStub("foo", {
              pausedAt: null,
            }),
          ]}
          onAlertsUpdated={() => {}}
        />
      </BadgeContainer>

      <BadgeContainer label="No Alerts">
        <ManageEngineAlertsSectionUI
          alertRules={[
            createEngineAlertRuleStub("foo"),
            createEngineAlertRuleStub("bar"),
          ]}
          createAlertMutation={createEngineAlertMutation}
          deleteAlert={deleteAlert}
          engineId="test-engine-id"
          isLoading={false}
          notificationChannels={[]}
          onAlertsUpdated={() => {}}
        />
      </BadgeContainer>

      <BadgeContainer label="Loading">
        <ManageEngineAlertsSectionUI
          alertRules={[
            createEngineAlertRuleStub("foo"),
            createEngineAlertRuleStub("bar"),
          ]}
          createAlertMutation={createEngineAlertMutation}
          deleteAlert={deleteAlert}
          engineId="test-engine-id"
          isLoading={true}
          notificationChannels={[]}
          onAlertsUpdated={() => {}}
        />
      </BadgeContainer>

      <BadgeContainer label="No Alert Rules">
        <ManageEngineAlertsSectionUI
          alertRules={[]}
          createAlertMutation={createEngineAlertMutation}
          deleteAlert={deleteAlert}
          engineId="test-engine-id"
          isLoading={false}
          notificationChannels={[]}
          onAlertsUpdated={() => {}}
        />
      </BadgeContainer>
    </div>
  );
}

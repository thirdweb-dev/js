import {
  Account,
  useUpdateNotifications,
} from "@3rdweb-sdk/react/hooks/useApi";
import { Divider, Flex, HStack, Switch, VStack } from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useState } from "react";
import { Heading, Text } from "tw-components";

interface NotificationsProps {
  account: Account;
}

export const Notifications: React.FC<NotificationsProps> = ({ account }) => {
  const [preferences, setPreferences] = useState({
    billing: account.notificationPreferences?.billing || "email",
    updates: account.notificationPreferences?.updates || "none",
  });

  const trackEvent = useTrack();
  const updateMutation = useUpdateNotifications();

  const { onSuccess, onError } = useTxNotifications(
    "Notification settings saved.",
    "Failed to save your notification settings.",
  );

  const handleChange = (name: "billing" | "updates", checked: boolean) => {
    const newPreferences = {
      ...preferences,
      [name]: checked ? "email" : "none",
    };
    setPreferences(newPreferences);

    updateMutation.mutate(newPreferences, {
      onSuccess: (data) => {
        onSuccess();

        trackEvent({
          category: "notifications",
          action: "update",
          label: "success",
          data,
        });
      },
      onError: (error) => {
        onError(error);

        trackEvent({
          category: "notifications",
          action: "update",
          label: "error",
          error,
        });
      },
    });
  };

  return (
    <VStack alignItems="flex-start" maxW="xl" gap={6}>
      <Divider />

      <HStack
        gap={8}
        alignItems="flex-start"
        justifyContent="space-between"
        w="full"
      >
        <Flex flexDir="column" gap={1}>
          <Heading size="label.lg">Reminders</Heading>
          <Text>Approaching and exceeding usage limits.</Text>
        </Flex>
        <Switch
          isChecked={preferences?.billing === "email"}
          onChange={(e) => handleChange("billing", e.target.checked)}
        />
      </HStack>

      <Divider />

      <HStack
        gap={8}
        alignItems="flex-start"
        justifyContent="space-between"
        w="full"
      >
        <Flex flexDir="column" gap={1}>
          <Heading size="label.lg">Product Updates</Heading>
          <Text>New features and key product updates.</Text>
        </Flex>
        <Switch
          isChecked={preferences?.updates === "email"}
          onChange={(e) => handleChange("updates", e.target.checked)}
        />
      </HStack>
    </VStack>
  );
};

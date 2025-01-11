"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  type Account,
  useUpdateNotifications,
} from "@3rdweb-sdk/react/hooks/useApi";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useState } from "react";

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
    <div>
      <SettingSwitch
        checked={preferences?.billing === "email"}
        onCheckedChange={(v) => handleChange("billing", v)}
        label="Reminders"
        description="Approaching and exceeding usage credits"
        id="reminders"
      />

      <SettingSwitch
        checked={preferences?.updates === "email"}
        onCheckedChange={(v) => handleChange("updates", v)}
        label="Product Updates"
        description="New features and key product updates"
        id="product-updates"
      />
    </div>
  );
};

function SettingSwitch(props: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  description: string;
  id: string;
}) {
  return (
    <div className="flex items-center justify-between gap-6 border-border border-b py-6">
      <div>
        <Label className="text-foreground text-lg" htmlFor={props.id}>
          {props.label}
        </Label>
        <p className="text-muted-foreground text-sm"> {props.description}</p>
      </div>
      <Switch
        checked={props.checked}
        onCheckedChange={props.onCheckedChange}
        id={props.id}
      />
    </div>
  );
}

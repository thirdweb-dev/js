"use client";

import {
  type Account,
  useUpdateNotifications,
} from "@3rdweb-sdk/react/hooks/useApi";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useId, useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface NotificationsProps {
  account: Account;
}

export const Notifications: React.FC<NotificationsProps> = ({ account }) => {
  const [preferences, setPreferences] = useState({
    billing: account.notificationPreferences?.billing || "email",
    updates: account.notificationPreferences?.updates || "none",
  });

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
      onError,
      onSuccess,
    });
  };

  return (
    <div>
      <SettingSwitch
        checked={preferences?.billing === "email"}
        description="Approaching and exceeding usage credits"
        label="Reminders"
        onCheckedChange={(v) => handleChange("billing", v)}
      />

      <SettingSwitch
        checked={preferences?.updates === "email"}
        description="New features and key product updates"
        label="Product Updates"
        onCheckedChange={(v) => handleChange("updates", v)}
      />
    </div>
  );
};

function SettingSwitch(props: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  description: string;
}) {
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-6 border-border border-b py-6">
      <div>
        <Label className="text-foreground text-lg" htmlFor={id}>
          {props.label}
        </Label>
        <p className="text-muted-foreground text-sm"> {props.description}</p>
      </div>
      <Switch
        checked={props.checked}
        id={id}
        onCheckedChange={props.onCheckedChange}
      />
    </div>
  );
}

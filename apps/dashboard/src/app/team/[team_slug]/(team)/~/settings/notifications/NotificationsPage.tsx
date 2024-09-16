"use client";

import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Separator } from "@/components/ui/separator";
import { useAccount } from "@3rdweb-sdk/react/hooks/useApi";
import { Notifications } from "components/settings/Account/Notifications";

export const SettingsNotificationsPage = () => {
  const meQuery = useAccount();
  const account = meQuery.data;

  if (!account) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner className="size-10" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-0.5">
        Notification Settings
      </h1>

      <p className="text-muted-foreground mb-7">
        Configure your email notification preferences
      </p>

      <Separator />
      <Notifications account={account} />
    </div>
  );
};

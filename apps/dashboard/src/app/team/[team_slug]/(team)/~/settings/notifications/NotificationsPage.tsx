"use client";
import { GenericLoadingPage } from "@/components/blocks/skeletons/GenericLoadingPage";
import { Separator } from "@/components/ui/separator";
import { useAccount } from "@3rdweb-sdk/react/hooks/useApi";
import { Notifications } from "components/settings/Account/Notifications";

export const SettingsNotificationsPage = () => {
  const meQuery = useAccount();
  const account = meQuery.data;

  if (!account) {
    return <GenericLoadingPage />;
  }

  return (
    <div>
      <h1 className="mb-0.5 font-semibold text-2xl tracking-tight">
        Notification Settings
      </h1>

      <p className="mb-7 text-muted-foreground">
        Configure your email notification preferences
      </p>

      <Separator />
      <Notifications account={account} />
    </div>
  );
};

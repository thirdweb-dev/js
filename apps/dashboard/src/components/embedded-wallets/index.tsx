import { TabButtons } from "@/components/ui/tabs";
import type { ApiKey } from "@3rdweb-sdk/react/hooks/useApi";
import type { EmbeddedWalletUser } from "@3rdweb-sdk/react/hooks/useEmbeddedWallets";
import { useState } from "react";
import { Configure } from "./Configure";
import { Users } from "./Users";

interface EmbeddedWalletsProps {
  apiKey: ApiKey;
  wallets: EmbeddedWalletUser[];
  isLoading: boolean;
  isFetched: boolean;
  trackingCategory: string;
  defaultTabIndex?: number;
}

export const EmbeddedWallets: React.FC<EmbeddedWalletsProps> = ({
  apiKey,
  wallets,
  isLoading,
  isFetched,
  trackingCategory,
  defaultTabIndex,
}) => {
  const [selectedTab, setSelectedTab] = useState<"users" | "config">(
    defaultTabIndex === 0 ? "users" : "config",
  );

  function updateSearchParams(value: string) {
    const url = new URL(window.location.href);
    url.searchParams.set("tab", value);
    window.history.pushState(null, "", url.toString());
  }

  return (
    <div>
      <TabButtons
        tabs={[
          {
            name: "Users",
            onClick: () => {
              setSelectedTab("users");
              updateSearchParams("0");
            },
            isActive: selectedTab === "users",
            isEnabled: true,
          },
          {
            name: "Configuration",
            onClick: () => {
              setSelectedTab("config");
              updateSearchParams("1");
            },
            isActive: selectedTab === "config",
            isEnabled: true,
          },
        ]}
      />

      <div className="h-6" />

      {selectedTab === "users" && (
        <Users
          wallets={wallets}
          isLoading={isLoading}
          isFetched={isFetched}
          trackingCategory={trackingCategory}
        />
      )}

      {selectedTab === "config" && (
        <Configure apiKey={apiKey} trackingCategory={trackingCategory} />
      )}
    </div>
  );
};

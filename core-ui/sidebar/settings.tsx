import { useRouter } from "next/router";
import { SidebarNav } from "./nav";
import { Route } from "./types";
import { useEffect } from "react";
import { useLocalStorage } from "hooks/useLocalStorage";

type SettingsSidebarProps = {
  activePage: "apiKeys" | "devices" | "usage" | "billing";
};

const links: Route[] = [
  { path: "/dashboard/settings/api-keys", title: "API Keys", name: "apiKeys" },
  { path: "/dashboard/settings/devices", title: "Devices", name: "devices" },
  {
    path: "/dashboard/settings/billing",
    title: "Account & Billing",
    name: "billing",
  },
  { path: "/dashboard/settings/usage", title: "Usage", name: "usage" },
];

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  activePage,
}) => {
  const router = useRouter();
  const [isSmartWalletsBeta, setIsSmartWalletsBeta] = useLocalStorage(
    "beta-smart-wallets-v1",
    false,
    true,
  );

  // FIXME: Remove when ff is lifted
  useEffect(() => {
    if (router.isReady) {
      const { smartWalletsBeta } = router.query;
      if (smartWalletsBeta && !isSmartWalletsBeta) {
        setIsSmartWalletsBeta(true);
      }
    }
  }, [isSmartWalletsBeta, router, setIsSmartWalletsBeta]);

  if (isSmartWalletsBeta) {
    return (
      <SidebarNav links={links} activePage={activePage} title="Settings" />
    );
  }

  return (
    <SidebarNav
      links={links.slice(0, 2)}
      activePage={activePage}
      title="Settings"
    />
  );
};

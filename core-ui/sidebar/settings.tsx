import { SidebarNav } from "./nav";
import { Route } from "./types";

type SettingsSidebarProps = {
  activePage: "apiKeys";
};

const links: Route[] = [
  { path: "/dashboard/settings/api-keys", title: "API Keys", name: "apiKeys" },
];

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  activePage,
}) => {
  return <SidebarNav links={links} activePage={activePage} title="Settings" />;
};

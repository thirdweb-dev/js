import { SidebarNav } from "./nav";
import { Route } from "./types";

type EngineSidebarProps = {
  activePage: "manage";
};

const links: Route[] = [
  { path: "/dashboard/engine", title: "Manage", name: "manage" },
];

export const EngineSidebar: React.FC<EngineSidebarProps> = ({ activePage }) => {
  return <SidebarNav links={links} activePage={activePage} title="Engine" />;
};

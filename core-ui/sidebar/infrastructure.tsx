import { SidebarNav } from "./nav";
import { Route } from "./types";

type InfrastructureSidebarProps = {
  activePage: "storage" | "rpc-edge";
};

const links: Route[] = [
  {
    path: "/dashboard/infrastructure/storage",
    title: "Storage",
    name: "storage",
  },
  {
    path: "/dashboard/infrastructure/rpc-edge",
    title: "RPC Edge",
    name: "rpc-edge",
  },
];

export const InfrastructureSidebar: React.FC<InfrastructureSidebarProps> = ({
  activePage,
}) => {
  return (
    <SidebarNav links={links} activePage={activePage} title="Infrastructure" />
  );
};

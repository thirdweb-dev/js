import { SidebarNav } from "./nav";
import { Route } from "./types";

type ContractsSidebarProps = {
  activePage: "deployed" | "published";
};

const links: Route[] = [
  { path: "/dashboard/contracts", title: "Deployed", name: "deployed" },
  {
    path: "/dashboard/contracts/published",
    title: "Published",
    name: "published",
  },
];

export const ContractsSidebar: React.FC<ContractsSidebarProps> = ({
  activePage,
}) => {
  return <SidebarNav links={links} activePage={activePage} title="Contracts" />;
};

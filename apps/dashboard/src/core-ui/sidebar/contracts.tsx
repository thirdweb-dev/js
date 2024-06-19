import { SidebarNav } from "./nav";
import { Route } from "./types";

type ContractsSidebarProps = {
  activePage: "build" | "explore" | "deploy" | "publish";
};

const links: Route[] = [
  { path: "/dashboard/contracts/deploy", title: "Deploy", name: "deploy" },
  {
    path: "/dashboard/contracts/publish",
    title: "Publish",
    name: "publish",
  },
  {
    path: "/explore",
    title: "Explore",
    name: "explore",
  },
  { path: "/dashboard/contracts/build", title: "Build", name: "build" },
];

export const ContractsSidebar: React.FC<ContractsSidebarProps> = ({
  activePage,
}) => {
  return <SidebarNav links={links} activePage={activePage} title="Contracts" />;
};

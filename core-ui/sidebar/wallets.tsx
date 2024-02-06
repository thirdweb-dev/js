import { SidebarNav } from "./nav";
import { Route } from "./types";

type WalletsSidebarProps = {
  activePage: "connect" | "analytics" | "smart-wallet" | "embedded";
};

const links: Route[] = [
  {
    path: "/dashboard/wallets/connect",
    title: "Connect",
    name: "connect",
  },
  {
    path: "/dashboard/wallets/analytics",
    title: "Analytics",
    name: "analytics",
  },
  {
    path: "/dashboard/wallets/embedded",
    title: "Embedded Wallets",
    name: "embedded",
  },
  {
    path: "/dashboard/wallets/smart-wallet",
    title: "Account Abstraction",
    name: "smart-wallet",
  },
];

export const WalletsSidebar: React.FC<WalletsSidebarProps> = ({
  activePage,
}) => {
  return <SidebarNav links={links} activePage={activePage} title="Wallets" />;
};

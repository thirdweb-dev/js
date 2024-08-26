import { SidebarNav } from "./nav";
import type { Route } from "./types";

type ConnectSidebarProps = {
  activePage:
    | "playground"
    | "analytics"
    | "embedded-wallets"
    | "account-abstraction"
    | "payments-contracts"
    | "payments-settings"
    | "pay-settings";
};

const links: Route[] = [
  {
    path: "/dashboard/connect/in-app-wallets",
    title: "In-App Wallets",
    name: "embedded-wallets",
  },
  {
    path: "/dashboard/connect/analytics",
    title: "Analytics",
    name: "analytics",
  },
  {
    path: "/dashboard/connect/ecosystem",
    title: "Ecosystem Wallets",
    name: "ecosystem",
  },
  {
    path: "/dashboard/connect/account-abstraction",
    title: "Account Abstraction",
    name: "account-abstraction",
  },
  {
    path: "/dashboard/connect/pay",
    title: "Pay",
    name: "pay-settings",
  },
  {
    name: "playground",
    title: "Playground",
    path: "https://playground.thirdweb.com/connect/sign-in/button",
  },
];

export const ConnectSidebar: React.FC<ConnectSidebarProps> = ({
  activePage,
}) => {
  return <SidebarNav links={links} activePage={activePage} title="Connect" />;
};

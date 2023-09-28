import { SidebarNav } from "./nav";
import { Route } from "./types";

type WalletsSidebarProps = {
  activePage:
    | "connect"
    | "wallet-sdk"
    | "smart-wallet"
    | "embedded"
    | "local"
    | "auth";
};

const links: Route[] = [
  {
    path: "/dashboard/wallets/connect",
    title: "Connect",
    name: "connect",
  },
  {
    path: "/dashboard/wallets/smart-wallet",
    title: "Smart Wallet",
    name: "smart-wallet",
  },
  {
    path: "/dashboard/wallets/embedded",
    title: "Embedded Wallets",
    name: "embedded",
  },
  {
    path: "/dashboard/wallets/local",
    title: "Local Wallet",
    name: "local",
  },
  {
    path: "/dashboard/wallets/wallet-sdk",
    title: "Wallet SDK",
    name: "wallet-sdk",
  },
  {
    path: "/dashboard/wallets/auth",
    title: "Auth",
    name: "auth",
  },
];

export const WalletsSidebar: React.FC<WalletsSidebarProps> = ({
  activePage,
}) => {
  return <SidebarNav links={links} activePage={activePage} title="Wallets" />;
};

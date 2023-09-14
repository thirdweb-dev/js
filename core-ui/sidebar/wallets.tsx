import { SidebarNav } from "./nav";
import { Route } from "./types";

type WalletsSidebarProps = {
  activePage: "connect" | "wallet-sdk" | "smart-wallet";
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
    path: "/dashboard/wallets/wallet-sdk",
    title: "Wallet SDK",
    name: "wallet-sdk",
  },
];

export const WalletsSidebar: React.FC<WalletsSidebarProps> = ({
  activePage,
}) => {
  return <SidebarNav links={links} activePage={activePage} title="Wallets" />;
};

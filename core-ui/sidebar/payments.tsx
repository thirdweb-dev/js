import { SidebarNav } from "./nav";
import { Route } from "./types";

type PaymentsSidebarProps = {
  activePage: "contracts" | "settings";
};

const links: Route[] = [
  {
    path: "/dashboard/payments/contracts",
    title: "Contracts",
    name: "contracts",
  },
  { path: "/dashboard/payments/settings", title: "Settings", name: "settings" },
];

export const PaymentsSidebar: React.FC<PaymentsSidebarProps> = ({
  activePage,
}) => {
  return <SidebarNav links={links} activePage={activePage} title="Payments" />;
};

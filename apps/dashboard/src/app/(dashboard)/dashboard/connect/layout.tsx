import { SidebarNav } from "../components/sidebar/sidebar.client";
import type { SidebarNavSection } from "../components/sidebar/types";

const SIDEBAR_SECTIONS = [
  {
    id: "connect",
    title: "Connect",
    items: [
      {
        id: "playground",
        title: "Playground",
        href: "/dashboard/connect/playground",
      },
      {
        id: "analytics",
        title: "Analytics",
        href: "/dashboard/connect/analytics",
      },
      {
        id: "embedded-wallets",
        title: "In-App Wallets",
        href: "/dashboard/connect/in-app-wallets",
      },
      {
        id: "ecosystem",
        title: "Ecosystem Wallets",
        href: "/dashboard/connect/ecosystem",
      },
      {
        id: "account-abstraction",
        title: "Account Abstraction",
        href: "/dashboard/connect/account-abstraction",
      },
      {
        id: "pay-settings",
        title: "Pay",
        href: "/dashboard/connect/pay",
      },
    ],
  },
] satisfies Array<SidebarNavSection>;

export default function DashboardConnectLayout(props: {
  children: React.ReactNode;
}) {
  return (
    <div className="container flex flex-col px-0 md:flex-row md:h-full">
      <SidebarNav sections={SIDEBAR_SECTIONS} />
      {props.children}
    </div>
  );
}

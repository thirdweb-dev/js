import { SidebarNav } from "../components/sidebar/sidebar.client";
import type { SidebarNavSection } from "../components/sidebar/types";

const SIDEBAR_SECTIONS = [
  {
    id: "connect",
    title: "Connect",
    items: [
      {
        id: "embedded-wallets",
        title: "In-App Wallets",
        href: "/dashboard/connect/in-app-wallets",
      },
      {
        id: "analytics",
        title: "Analytics",
        href: "/dashboard/connect/analytics",
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
      {
        id: "playground",
        title: "Playground",
        href: "https://playground.thirdweb.com/connect/sign-in/button",
      },
    ],
  },
] satisfies Array<SidebarNavSection>;

export default function DashboardConnectLayout(props: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row md:h-full container px-4">
      <SidebarNav sections={SIDEBAR_SECTIONS} />
      {props.children}
    </div>
  );
}

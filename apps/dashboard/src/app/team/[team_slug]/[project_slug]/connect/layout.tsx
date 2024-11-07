import type { SidebarLink } from "@/components/blocks/Sidebar";
import { SidebarLayout } from "@/components/blocks/SidebarLayout";
import { BillingAlerts } from "components/settings/Account/Billing/alerts/Alert";

export default async function Layout(props: {
  params: Promise<{
    team_slug: string;
    project_slug: string;
  }>;
  children: React.ReactNode;
}) {
  const { team_slug, project_slug } = await props.params;

  const links: SidebarLink[] = [
    {
      label: "Analytics",
      href: `/team/${team_slug}/${project_slug}/connect`,
      exactMatch: true,
    },
    {
      label: "In-App Wallets",
      href: `/team/${team_slug}/${project_slug}/connect/in-app-wallets`,
    },
    {
      label: "Account Abstraction",
      href: `/team/${team_slug}/${project_slug}/connect/account-abstraction`,
    },
    {
      label: "Pay",
      href: `/team/${team_slug}/${project_slug}/connect/pay`,
    },
    {
      label: "Playground",
      href: "https://playground.thirdweb.com/connect/sign-in/button",
    },
  ];

  return (
    <SidebarLayout sidebarLinks={links}>
      <BillingAlerts className="mb-10" />
      {props.children}
    </SidebarLayout>
  );
}

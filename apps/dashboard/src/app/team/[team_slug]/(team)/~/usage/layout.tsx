import { SidebarLayout } from "@/components/blocks/SidebarLayout";
import { BillingAlerts } from "components/settings/Account/Billing/alerts/Alert";

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{
    team_slug: string;
  }>;
}) {
  const params = await props.params;
  return (
    <SidebarLayout
      sidebarLinks={[
        {
          href: `/team/${params.team_slug}/~/usage`,
          exactMatch: true,
          label: "Overview",
        },
        {
          href: `/team/${params.team_slug}/~/usage/storage`,
          exactMatch: true,
          label: "Storage",
        },
      ]}
    >
      <BillingAlerts className="mb-10" />
      {props.children}
    </SidebarLayout>
  );
}

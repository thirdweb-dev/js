import { SidebarLayout } from "@/components/blocks/SidebarLayout";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{
    team_slug: string;
  }>;
}) {
  const params = await props.params;
  return (
    <div className="flex grow flex-col">
      <div className="border-border border-b py-10">
        <div className="container flex flex-row justify-between">
          <h1 className="font-semibold text-3xl tracking-tight lg:px-2">
            Usage
          </h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href={`/team/${params.team_slug}/~/settings/billing`}>
                Billing Settings
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/team/${params.team_slug}/~/settings/invoices`}>
                Invoice History
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <SidebarLayout
        sidebarLinks={[
          {
            href: `/team/${params.team_slug}/~/usage`,
            exactMatch: true,
            label: "Overview",
          },
          {
            href: `/team/${params.team_slug}/~/usage/rpc`,
            exactMatch: true,
            label: "RPC",
          },
          {
            href: `/team/${params.team_slug}/~/usage/storage`,
            exactMatch: true,
            label: "Storage",
          },
          {
            href: `/team/${params.team_slug}/~/usage/account-abstraction`,
            exactMatch: true,
            label: "Account Abstraction",
          },
        ]}
      >
        {props.children}
      </SidebarLayout>
    </div>
  );
}

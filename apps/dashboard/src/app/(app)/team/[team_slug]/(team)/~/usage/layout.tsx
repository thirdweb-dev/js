import Link from "next/link";
import { SidebarLayout } from "@/components/blocks/SidebarLayout";
import { Button } from "@/components/ui/button";

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
            <Button asChild variant="outline">
              <Link href={`/team/${params.team_slug}/~/settings/billing`}>
                Billing Settings
              </Link>
            </Button>
            <Button asChild variant="outline">
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
            exactMatch: true,
            href: `/team/${params.team_slug}/~/usage`,
            label: "Overview",
          },
          {
            exactMatch: true,
            href: `/team/${params.team_slug}/~/usage/rpc`,
            label: "RPC",
          },
          {
            exactMatch: true,
            href: `/team/${params.team_slug}/~/usage/storage`,
            label: "Storage",
          },
          {
            exactMatch: true,
            href: `/team/${params.team_slug}/~/usage/account-abstraction`,
            label: "Account Abstraction",
          },
        ]}
      >
        {props.children}
      </SidebarLayout>
    </div>
  );
}

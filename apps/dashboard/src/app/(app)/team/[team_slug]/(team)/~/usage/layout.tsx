import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TabPathLinks } from "@/components/ui/tabs";

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{
    team_slug: string;
  }>;
}) {
  const params = await props.params;
  const usagePath = `/team/${params.team_slug}/~/usage`;

  return (
    <div className="flex grow flex-col">
      <div className="border-border pt-10 pb-6">
        <div className="container max-w-7xl flex flex-col gap-4 lg:flex-row lg:justify-between">
          <h1 className="font-semibold text-3xl tracking-tight">Usage</h1>
          <div className="items-center gap-3 hidden lg:flex">
            <Button asChild className="rounded-full bg-card" variant="outline">
              <Link href={`/team/${params.team_slug}/~/billing`}>
                Billing Settings
              </Link>
            </Button>
            <Button asChild className="rounded-full bg-card" variant="outline">
              <Link href={`/team/${params.team_slug}/~/billing/invoices`}>
                Invoice History
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <TabPathLinks
        links={[
          {
            exactMatch: true,
            name: "Overview",
            path: usagePath,
          },
          {
            name: "RPC",
            path: `${usagePath}/rpc`,
          },
          {
            name: "Storage",
            path: `${usagePath}/storage`,
          },
          {
            name: "Gas Sponsorship",
            path: `${usagePath}/account-abstraction`,
          },
        ]}
        scrollableClassName="container max-w-7xl"
      />

      <div className="flex grow flex-col container max-w-7xl pt-6 pb-10">
        {props.children}
      </div>
    </div>
  );
}

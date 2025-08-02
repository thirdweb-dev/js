import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TabPathLinks } from "@/components/ui/tabs";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "@/constants/public-envs";

export default async function Page(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
  children: React.ReactNode;
}) {
  const { team_slug, project_slug } = await props.params;

  return (
    <TransactionsLayout projectSlug={project_slug} teamSlug={team_slug}>
      {props.children}
    </TransactionsLayout>
  );
}

function TransactionsLayout(props: {
  projectSlug: string;
  teamSlug: string;
  children: React.ReactNode;
}) {
  const projectLayoutPath = `/team/${props.teamSlug}/${props.projectSlug}`;
  const layoutPath = `${projectLayoutPath}/transactions`;

  return (
    <div className="flex grow flex-col">
      {/* top */}
      <div className="pt-4 lg:pt-6">
        {/* header */}
        <div className="container flex max-w-7xl flex-col gap-4">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col">
              <h1 className="mb-1 flex items-center gap-2 font-semibold text-3xl tracking-tight">
                Transactions{" "}
                <Badge
                  className="mt-0.5 flex items-center gap-2 text-sm"
                  variant="outline"
                >
                  Beta
                </Badge>
              </h1>
              <div className="flex items-center gap-2">
                <Link
                  className="max-w-full truncate text-muted-foreground text-sm hover:text-foreground" // TODO: change this
                  href={`${NEXT_PUBLIC_THIRDWEB_API_HOST}/reference`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {NEXT_PUBLIC_THIRDWEB_API_HOST}
                </Link>
              </div>
            </div>
            <Button variant="outline" asChild className="rounded-full">
              <Link href={`${projectLayoutPath}/engine/dedicated`}>
                View Dedicated Engine
              </Link>
            </Button>
          </div>
        </div>

        <div className="h-4" />

        {/* Nav */}
        <TabPathLinks
          links={[
            {
              exactMatch: true,
              name: "Transactions",
              path: `${layoutPath}`,
            },
            {
              name: "API Explorer",
              path: `${layoutPath}/explorer`,
            },
            {
              name: "Server Wallets",
              path: `${layoutPath}/server-wallets`,
            },
          ]}
          scrollableClassName="container max-w-7xl"
        />
      </div>
      <div className="h-6" />
      <div className="container flex max-w-7xl grow flex-col gap-6">
        <div>{props.children}</div>
      </div>
      <div className="h-20" />
    </div>
  );
}

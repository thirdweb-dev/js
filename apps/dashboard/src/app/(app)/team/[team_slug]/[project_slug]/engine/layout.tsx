import { getProject } from "@/api/projects";
import { getTeamBySlug } from "@/api/team";
import { Badge } from "@/components/ui/badge";
import { TabPathLinks } from "@/components/ui/tabs";
import { THIRDWEB_ENGINE_CLOUD_URL } from "@/constants/env";
import { CloudIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "../../../../../../@/components/ui/button";

export default async function Page(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
  children: React.ReactNode;
}) {
  const { team_slug, project_slug } = await props.params;

  const [team, project] = await Promise.all([
    getTeamBySlug(team_slug),
    getProject(team_slug, project_slug),
  ]);

  if (!team) {
    redirect("/team");
  }

  if (!project) {
    redirect(`/team/${team_slug}`);
  }

  return (
    <TransactionsLayout
      projectSlug={project.slug}
      teamSlug={team_slug}
      clientId={project.publishableKey}
    >
      {props.children}
    </TransactionsLayout>
  );
}

function TransactionsLayout(props: {
  projectSlug: string;
  teamSlug: string;
  clientId: string;
  children: React.ReactNode;
}) {
  const engineLayoutSlug = `/team/${props.teamSlug}/${props.projectSlug}/engine`;

  return (
    <div className="flex grow flex-col">
      {/* top */}
      <div className="pt-4 lg:pt-6">
        {/* header */}
        <div className="container flex max-w-7xl flex-col gap-4">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col">
              <h1 className="mb-0.5 font-semibold text-2xl tracking-tight lg:text-3xl">
                Engine
              </h1>
              <div className="flex items-center gap-2">
                <Link
                  href={`${THIRDWEB_ENGINE_CLOUD_URL}/reference`} // TODO: change this
                  target="_blank"
                  className="max-w-full truncate py-1 text-muted-foreground"
                >
                  {THIRDWEB_ENGINE_CLOUD_URL}
                </Link>
                <Badge variant="success" className="flex items-center gap-2">
                  <CloudIcon className="h-4 w-4" />
                  Cloud
                </Badge>
              </div>
            </div>
            <Link href={`/team/${props.teamSlug}/~/engine`} target="_blank">
              <Button variant="outline">Looking for legacy engines?</Button>
            </Link>
          </div>
        </div>

        <div className="h-4" />

        {/* Nav */}
        <TabPathLinks
          scrollableClassName="container max-w-7xl"
          links={[
            {
              name: "Transactions",
              path: `${engineLayoutSlug}`,
              exactMatch: true,
            },
            {
              name: "API Explorer",
              path: `${engineLayoutSlug}/explorer`,
            },
            {
              name: "Server Wallets",
              path: `${engineLayoutSlug}/server-wallets`,
            },
            {
              name: "Vault",
              path: `${engineLayoutSlug}/vault`,
            },
          ]}
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

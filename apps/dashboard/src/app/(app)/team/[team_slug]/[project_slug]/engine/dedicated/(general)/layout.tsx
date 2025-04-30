import type { SidebarLink } from "@/components/blocks/Sidebar";
import { SidebarLayout } from "@/components/blocks/SidebarLayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DatabaseIcon } from "lucide-react";
import Link from "next/link";
import { EngineIcon } from "../../../../../../(dashboard)/(chain)/components/server/icons/EngineIcon";
import { ImportEngineLink } from "./_components";

export default async function Layout(props: {
  params: Promise<{
    team_slug: string;
    project_slug: string;
  }>;
  children: React.ReactNode;
}) {
  const params = await props.params;
  const linkPrefix = `/team/${params.team_slug}/${params.project_slug}/engine/dedicated`;
  const sidebarLinks: SidebarLink[] = [
    {
      label: "Engine Instances",
      href: `${linkPrefix}`,
      exactMatch: true,
    },
    {
      label: "Import Engine",
      href: `${linkPrefix}/import`,
    },
  ];

  return (
    <div className="container flex max-w-7xl grow flex-col">
      {/* header */}
      <header className="border-border border-b py-10">
        <div className="container flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className="flex flex-col gap-2">
            <h1 className="flex items-center gap-2 font-semibold text-3xl tracking-tight">
              Engine{" "}
              <Badge
                variant="warning"
                className="flex items-center gap-2 text-sm"
              >
                <DatabaseIcon className="size-4" /> Dedicated
              </Badge>
            </h1>
            <p className="flex flex-col text-muted-foreground text-sm">
              Manage your deployed Engine instances
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ImportEngineLink
              label="Import Engine"
              engineLinkPrefix={linkPrefix}
            />
          </div>
        </div>
        <div className="h-6" />
        <div className="container">
          <EngineLegacyBannerUI
            teamSlug={params.team_slug}
            projectSlug={params.project_slug}
          />
        </div>
      </header>

      {/* sidebar layout */}
      <SidebarLayout sidebarLinks={sidebarLinks}>
        {props.children}
      </SidebarLayout>
    </div>
  );
}

function EngineLegacyBannerUI(props: {
  teamSlug: string;
  projectSlug: string;
}) {
  return (
    <Alert variant="info">
      <EngineIcon className="size-5" />
      <AlertTitle>Engine Cloud (Beta)</AlertTitle>
      <AlertDescription>
        <div className="h-2" />
        <p className="text-primary-foreground text-sm">
          Try Engine Cloud (Beta) - now included for free in every thirdweb
          project.
        </p>
        <div className="h-2" />
        <ul className="list-disc pl-4 text-muted-foreground text-sm">
          <li>No recurring monthly cost, pay-per-request model</li>
          <li>Powered by Vault: our new TEE based key management system</li>
          <li>Improved performance and simplified transaction API</li>
        </ul>
        <div className="h-4" />
        <div className="flex justify-end gap-2">
          {/* TODO (cloud): add link to Engine Cloud blog post */}
          <Link
            href={"https://portal.thirdweb.com/engine/cloud"}
            target="_blank"
          >
            <Button variant="outline">Learn More</Button>
          </Link>
          <Link href={`/team/${props.teamSlug}/${props.projectSlug}/engine`}>
            <Button variant={"primary"} className="flex items-center gap-2">
              <EngineIcon className="size-4" /> Try Engine Cloud
            </Button>
          </Link>
        </div>
      </AlertDescription>
    </Alert>
  );
}

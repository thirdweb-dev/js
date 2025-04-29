import type { SidebarLink } from "@/components/blocks/Sidebar";
import { SidebarLayout } from "@/components/blocks/SidebarLayout";
import { CloudIcon } from "lucide-react";
import Link from "next/link";
import { Badge } from "../../../../../../../../@/components/ui/badge";
import { Button } from "../../../../../../../../@/components/ui/button";
import { ImportEngineLink } from "./_components";

export default async function Layout(props: {
  params: Promise<{
    team_slug: string;
  }>;
  children: React.ReactNode;
}) {
  const params = await props.params;
  const linkPrefix = `/team/${params.team_slug}/~/engine`;
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
    <div className="flex grow flex-col">
      {/* header */}
      <header className="border-border border-b py-10">
        <div className="container flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className="flex flex-col gap-2">
            <h1 className="flex items-center gap-2 font-semibold text-3xl tracking-tight">
              Engines <Badge variant="warning">Legacy</Badge>
            </h1>
            <p className="flex flex-col text-muted-foreground text-sm">
              {/* TODO (cloud): add link to Engine Cloud blog post */}
              The latest version of Engine has moved inside projects. Your
              legacy engines will remain available here.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href={`/team/${params.team_slug}`}>
              <Button variant={"upsell"}>
                <CloudIcon className="mr-2 h-4 w-4" /> Try Engine Cloud for Free
              </Button>
            </Link>
            <ImportEngineLink
              label="Import Engine"
              engineLinkPrefix={linkPrefix}
            />
          </div>
        </div>
      </header>

      {/* sidebar layout */}
      <SidebarLayout sidebarLinks={sidebarLinks}>
        {props.children}
      </SidebarLayout>
    </div>
  );
}

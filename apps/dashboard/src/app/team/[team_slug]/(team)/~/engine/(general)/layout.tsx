import type { SidebarLink } from "@/components/blocks/Sidebar";
import { SidebarLayout } from "@/components/blocks/SidebarLayout";
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
          <h1 className="font-semibold text-3xl tracking-tight">Engines</h1>
          <div className="flex items-center gap-3">
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

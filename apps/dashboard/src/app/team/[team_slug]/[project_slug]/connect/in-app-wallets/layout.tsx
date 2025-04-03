import { getProject } from "@/api/projects";
import { TabPathLinks } from "@/components/ui/tabs";
import { redirect } from "next/navigation";
import { InAppWalletsFooter } from "./_components/footer";
import { InAppWalletsHeader } from "./_components/header";

export default async function Layout(props: {
  params: Promise<{
    team_slug: string;
    project_slug: string;
  }>;
  children: React.ReactNode;
}) {
  const params = await props.params;
  const project = await getProject(params.team_slug, params.project_slug);

  if (!project) {
    redirect(`/team/${params.team_slug}`);
  }

  const { team_slug, project_slug } = params;

  return (
    <div className="flex grow flex-col">
      {/* header */}
      <div className="pt-4 lg:pt-6">
        <div className="container max-w-7xl">
          <InAppWalletsHeader />
        </div>
        <div className="h-3" />
        <TabPathLinks
          scrollableClassName="container max-w-7xl"
          links={[
            {
              name: "Analytics",
              path: `/team/${team_slug}/${project_slug}/connect/in-app-wallets`,
              exactMatch: true,
            },
            {
              name: "Users",
              path: `/team/${team_slug}/${project_slug}/connect/in-app-wallets/users`,
              exactMatch: true,
            },
            {
              name: "Settings",
              path: `/team/${team_slug}/${project_slug}/connect/in-app-wallets/settings`,
              exactMatch: true,
            },
          ]}
        />
      </div>

      {/* content */}
      <div className="container flex max-w-7xl grow flex-col">
        <div className="h-6" />
        {props.children}
        <div className="h-20" />
      </div>

      {/* footer */}
      <div className="border-t">
        <div className="container max-w-7xl">
          <InAppWalletsFooter />
        </div>
      </div>
    </div>
  );
}

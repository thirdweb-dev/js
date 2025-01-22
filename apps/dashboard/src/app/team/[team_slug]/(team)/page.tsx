import { getWalletConnections } from "@/api/analytics";
import { type Project, getProjects } from "@/api/projects";
import { getTeamBySlug } from "@/api/team";
import { Changelog } from "components/dashboard/Changelog";
import { redirect } from "next/navigation";
import { TeamProjectsPage } from "./~/projects/TeamProjectsPage";

export default async function Page(props: {
  params: Promise<{ team_slug: string }>;
}) {
  const params = await props.params;
  const team = await getTeamBySlug(params.team_slug);

  if (!team) {
    redirect("/team");
  }

  const projects = await getProjects(params.team_slug);
  const projectsWithTotalWallets = await getProjectsWithTotalWallets(projects);

  return (
    <div className="container flex grow flex-col gap-12 py-8 lg:flex-row">
      <div className="flex grow flex-col">
        <h1 className="mb-4 font-semibold text-2xl tracking-tight">Projects</h1>
        <TeamProjectsPage projects={projectsWithTotalWallets} team={team} />
      </div>
      <div className="shrink-0 lg:w-[320px]">
        <h2 className="mb-4 font-semibold text-2xl tracking-tight">
          Changelog
        </h2>
        <Changelog />
      </div>
    </div>
  );
}

async function getProjectsWithTotalWallets(
  projects: Project[],
): Promise<Array<Project & { totalConnections: number }>> {
  return Promise.all(
    projects.map(async (p) => {
      try {
        const data = await getWalletConnections({
          clientId: p.publishableKey,
          period: "all",
        });

        let totalConnections = 0;
        for (const d of data) {
          totalConnections += d.totalConnections;
        }

        return {
          ...p,
          totalConnections,
        };
      } catch {
        return {
          ...p,
          totalConnections: 0,
        };
      }
    }),
  );
}

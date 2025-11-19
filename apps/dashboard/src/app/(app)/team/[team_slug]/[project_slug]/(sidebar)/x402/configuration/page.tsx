import { redirect } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/project/projects";
import { getTeamBySlug } from "@/api/team/get-team";
import { getX402Fees } from "@/api/x402/config";
import { getProjectWallet } from "@/lib/server/project-wallet";
import { loginRedirect } from "@/utils/redirects";
import { X402FeeConfig } from "./X402FeeConfig";

export default async function Page(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const { team_slug, project_slug } = await props.params;

  const [team, project, authToken] = await Promise.all([
    getTeamBySlug(team_slug),
    getProject(team_slug, project_slug),
    getAuthToken(),
  ]);

  if (!authToken) {
    loginRedirect(`/team/${team_slug}/${project_slug}/x402/configuration`);
  }

  if (!team) {
    redirect("/team");
  }

  if (!project) {
    redirect(`/team/${team_slug}`);
  }

  const projectWallet = await getProjectWallet(project);

  const fees = getX402Fees(project);

  return (
    <div className="flex flex-col gap-6">
      <X402FeeConfig
        fees={fees}
        project={project}
        projectWalletAddress={projectWallet?.address}
      />
    </div>
  );
}

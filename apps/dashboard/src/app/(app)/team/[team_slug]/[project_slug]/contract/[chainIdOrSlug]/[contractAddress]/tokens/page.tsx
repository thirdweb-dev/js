import { notFound } from "next/navigation";
import { getProject } from "@/api/projects";
import { SharedContractTokensPage } from "../../../../../../../(dashboard)/(chain)/[chain_id]/[contractAddress]/tokens/shared-page";
import type { ProjectContractPageParams } from "../types";

export default async function Page(props: {
  params: Promise<ProjectContractPageParams>;
}) {
  const params = await props.params;
  const project = await getProject(params.team_slug, params.project_slug);

  if (!project) {
    notFound();
  }

  return (
    <SharedContractTokensPage
      chainIdOrSlug={params.chainIdOrSlug}
      contractAddress={params.contractAddress}
      isLoggedIn={true}
      projectMeta={{
        projectSlug: project.slug,
        teamId: project.teamId,
        teamSlug: params.team_slug,
      }}
    />
  );
}

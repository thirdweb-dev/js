import { notFound } from "next/navigation";
import { getProject } from "@/api/project/projects";
import { SharedContractSourcesPage } from "../../../../../../../(dashboard)/(chain)/[chain_id]/[contractAddress]/sources/shared-sources-page";
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
    <SharedContractSourcesPage
      chainIdOrSlug={params.chainIdOrSlug}
      contractAddress={params.contractAddress}
      projectMeta={{
        projectSlug: project.slug,
        teamId: project.teamId,
        teamSlug: params.team_slug,
      }}
    />
  );
}

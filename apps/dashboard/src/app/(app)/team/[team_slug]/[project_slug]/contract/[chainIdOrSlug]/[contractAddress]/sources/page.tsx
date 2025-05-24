import { getProject } from "@/api/projects";
import { notFound } from "next/navigation";
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
      contractAddress={params.contractAddress}
      chainIdOrSlug={params.chainIdOrSlug}
      projectMeta={{
        teamId: project.teamId,
        projectSlug: project.slug,
        teamSlug: params.team_slug,
      }}
    />
  );
}

import { notFound } from "next/navigation";
import { getProject } from "@/api/project/projects";
import { SharedCrossChainPage } from "../../../../../../../(dashboard)/(chain)/[chain_id]/[contractAddress]/cross-chain/shared-cross-chain-page";
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
    <SharedCrossChainPage
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

import { getProject } from "@/api/projects";
import { notFound } from "next/navigation";
import { SharedClaimConditionsPage } from "../../../../../../../(dashboard)/(chain)/[chain_id]/[contractAddress]/claim-conditions/shared-claim-conditions-page";
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
    <SharedClaimConditionsPage
      contractAddress={params.contractAddress}
      chainIdOrSlug={params.chainIdOrSlug}
      projectMeta={{
        projectSlug: project.slug,
        teamId: project.teamId,
        teamSlug: params.team_slug,
      }}
      isLoggedIn={true}
    />
  );
}

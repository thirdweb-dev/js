import { getProject } from "@/api/projects";
import { notFound } from "next/navigation";
import { SharedEventsPage } from "../../../../../../../(dashboard)/(chain)/[chain_id]/[contractAddress]/events/shared-events-page";
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
    <SharedEventsPage
      contractAddress={params.contractAddress}
      chainIdOrSlug={params.chainIdOrSlug}
      projectMeta={{
        projectSlug: project.slug,
        teamId: project.teamId,
        teamSlug: params.team_slug,
      }}
    />
  );
}

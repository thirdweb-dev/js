import { getProject } from "@/api/projects";
import { notFound } from "next/navigation";
import { SharedAccountsPage } from "../../../../../../../(dashboard)/(chain)/[chain_id]/[contractAddress]/accounts/shared-accounts-page";
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
    <SharedAccountsPage
      contractAddress={params.contractAddress}
      chainIdOrSlug={params.chainIdOrSlug}
      projectMeta={{
        teamId: project.teamId,
        projectSlug: project.slug,
        teamSlug: params.team_slug,
      }}
      isLoggedIn={true}
    />
  );
}

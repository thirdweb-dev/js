import { getProject } from "@/api/projects";
import { notFound } from "next/navigation";
import { SharedNFTPage } from "../../../../../../../(dashboard)/(chain)/[chain_id]/[contractAddress]/nfts/shared-nfts-page";
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
    <SharedNFTPage
      contractAddress={params.contractAddress}
      chainIdOrSlug={params.chainIdOrSlug}
      isLoggedIn={true}
      projectMeta={{
        projectSlug: project.slug,
        teamId: project.teamId,
        teamSlug: params.team_slug,
      }}
    />
  );
}

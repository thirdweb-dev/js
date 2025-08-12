import { notFound } from "next/navigation";
import { getProject } from "@/api/project/projects";
import { SharedEnglishAuctionsPage } from "../../../../../../../../(dashboard)/(chain)/[chain_id]/[contractAddress]/(marketplace)/english-auctions/shared-english-auctions-page";
import type { ProjectContractPageParams } from "../../types";

export default async function Page(props: {
  params: Promise<ProjectContractPageParams>;
}) {
  const params = await props.params;
  const project = await getProject(params.team_slug, params.project_slug);

  if (!project) {
    notFound();
  }

  return (
    <SharedEnglishAuctionsPage
      chainIdOrSlug={params.chainIdOrSlug}
      contractAddress={params.contractAddress}
      isLoggedIn={true}
      projectMeta={{
        projectSlug: params.project_slug,
        teamId: project.teamId,
        teamSlug: params.team_slug,
      }}
    />
  );
}

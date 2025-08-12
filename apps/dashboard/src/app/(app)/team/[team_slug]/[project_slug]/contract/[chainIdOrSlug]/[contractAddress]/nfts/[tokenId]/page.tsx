import { notFound } from "next/navigation";
import { getProject } from "@/api/project/projects";
import { SharedNFTTokenPage } from "../../../../../../../../(dashboard)/(chain)/[chain_id]/[contractAddress]/nfts/[tokenId]/shared-nfts-token-page";
import type { ProjectContractPageParams } from "../../types";

export default async function Page(props: {
  params: Promise<
    ProjectContractPageParams & {
      tokenId: string;
    }
  >;
}) {
  const params = await props.params;
  const project = await getProject(params.team_slug, params.project_slug);

  if (!project) {
    notFound();
  }

  return (
    <SharedNFTTokenPage
      chainIdOrSlug={params.chainIdOrSlug}
      contractAddress={params.contractAddress}
      isLoggedIn={true}
      projectMeta={{
        projectSlug: project.slug,
        teamId: project.teamId,
        teamSlug: params.team_slug,
      }}
      tokenId={params.tokenId}
    />
  );
}

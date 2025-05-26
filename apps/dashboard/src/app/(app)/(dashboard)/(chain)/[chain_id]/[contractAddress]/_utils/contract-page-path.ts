import type { ProjectMeta } from "../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";

export function buildContractPagePath(params: {
  projectMeta: ProjectMeta | undefined;
  chainIdOrSlug: string;
  contractAddress: string;
  subpath?: `/${string}`;
}) {
  const { projectMeta, chainIdOrSlug, contractAddress, subpath } = params;
  if (projectMeta) {
    return `/team/${projectMeta.teamSlug}/${projectMeta.projectSlug}/contract/${chainIdOrSlug}/${contractAddress}${subpath || ""}`;
  }

  return `/${chainIdOrSlug}/${contractAddress}${subpath || ""}`;
}

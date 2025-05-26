export type ProjectContractPageParams = {
  contractAddress: string;
  chainIdOrSlug: string;
  team_slug: string;
  project_slug: string;
};

export type ProjectMeta = {
  teamId: string;
  projectSlug: string;
  teamSlug: string;
};

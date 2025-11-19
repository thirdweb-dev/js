export function projectContractsCacheTag(params: {
  teamId: string;
  projectId: string;
}) {
  return `${params.teamId}/${params.projectId}/project-contracts`;
}

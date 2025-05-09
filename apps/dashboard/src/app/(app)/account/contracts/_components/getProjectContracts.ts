import "server-only";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "@/constants/public-envs";

export type ProjectContract = {
  id: string;
  contractAddress: string;
  chainId: string;
  createdAt: string;
  updatedAt: string;
};

export async function getProjectContracts(options: {
  teamId: string;
  projectId: string;
  authToken: string;
}) {
  const res = await fetch(
    `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${options.teamId}/projects/${options.projectId}/contracts`,
    {
      headers: {
        Authorization: `Bearer ${options.authToken}`,
      },
    },
  );

  if (!res.ok) {
    const errorMessage = await res.text();
    console.error("Error fetching project contracts");
    console.error(errorMessage);
    return [];
  }

  const data = (await res.json()) as {
    result: ProjectContract[];
  };

  return data.result;
}

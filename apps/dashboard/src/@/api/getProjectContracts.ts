import "server-only";
import { getAddress } from "thirdweb";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "@/constants/public-envs";

export type ProjectContract = {
  id: string;
  contractAddress: string;
  chainId: string;
  createdAt: string;
  updatedAt: string;
  deploymentType: string | null;
  contractType: string | null;
};

export async function getProjectContracts(options: {
  teamId: string;
  projectId: string;
  authToken: string;
  deploymentType: string | undefined;
}) {
  const url = new URL(
    `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${options.teamId}/projects/${options.projectId}/contracts`,
  );
  if (options.deploymentType) {
    url.searchParams.set("deploymentType", options.deploymentType);
  }

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${options.authToken}`,
    },
  });

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

export type PartialProject = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
};

/**
 * get a list of projects within a team that have a given contract imported
 */
export async function getContractImportedProjects(options: {
  teamId: string;
  authToken: string;
  chainId: number;
  contractAddress: string;
}) {
  const url = new URL(
    `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${options.teamId}/projects/contracts/lookup?chainId=${options.chainId}&contractAddress=${getAddress(options.contractAddress)}`,
  );

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${options.authToken}`,
    },
  });

  if (!res.ok) {
    const errorMessage = await res.text();
    console.error("Error fetching: /projects/contracts/lookup");
    console.error(errorMessage);
    return [];
  }

  const data = (await res.json()) as {
    result: PartialProject[];
  };

  return data.result;
}

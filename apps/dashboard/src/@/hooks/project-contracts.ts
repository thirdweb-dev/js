"use client";

import { useMutation } from "@tanstack/react-query";
import { apiServerProxy } from "@/actions/proxies";

export function useAddContractToProject() {
  return useMutation({
    mutationFn: async (params: {
      teamId: string;
      projectId: string;
      contractAddress: string;
      chainId: string;
      deploymentType: "asset" | "marketplace" | undefined;
      contractType:
        | "DropERC20"
        | "DropERC721"
        | "DropERC1155"
        | "MarketplaceV3"
        | undefined;
    }) => {
      const res = await apiServerProxy({
        body: JSON.stringify({
          chainId: params.chainId,
          contractAddress: params.contractAddress,
          contractType: params.contractType,
          deploymentType: params.deploymentType,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        pathname: `/v1/teams/${params.teamId}/projects/${params.projectId}/contracts`,
      });

      if (!res.ok) {
        console.error(res.error);
        throw new Error(res.error);
      }

      return res.data as {
        result: {
          id: string;
          projectId: string;
          contractAddress: string;
          chainId: string;
          createdAt: string;
          updatedAt: string;
        };
      };
    },
  });
}

export async function removeContractFromProject(params: {
  teamId: string;
  projectId: string;
  contractId: string;
}) {
  const res = await apiServerProxy({
    method: "DELETE",
    pathname: `/v1/teams/${params.teamId}/projects/${params.projectId}/contracts/${params.contractId}`,
  });

  if (!res.ok) {
    throw new Error(res.error);
  }

  return res.data as {
    result: {
      success: boolean;
    };
  };
}

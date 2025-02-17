"use client";

import { apiServerProxy } from "@/actions/proxies";
import { useMutation } from "@tanstack/react-query";

export function useAddContractToProject() {
  return useMutation({
    mutationFn: async (params: {
      teamId: string;
      projectId: string;
      contractAddress: string;
      chainId: string;
    }) => {
      const res = await apiServerProxy({
        pathname: `/v1/teams/${params.teamId}/projects/${params.projectId}/contracts`,
        method: "POST",
        body: JSON.stringify({
          contractAddress: params.contractAddress,
          chainId: params.chainId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
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
    pathname: `/v1/teams/${params.teamId}/projects/${params.projectId}/contracts/${params.contractId}`,
    method: "DELETE",
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

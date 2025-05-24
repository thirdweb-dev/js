import "server-only";
import { redirect } from "next/navigation";
import { buildContractPagePath } from "../../../../../../(dashboard)/(chain)/[chain_id]/[contractAddress]/_utils/contract-page-path";
import type { ProjectMeta } from "./types";

export function redirectToContractLandingPage(params: {
  chainIdOrSlug: string;
  contractAddress: string;
  projectMeta: ProjectMeta | undefined;
}): never {
  redirect(
    buildContractPagePath({
      projectMeta: params.projectMeta,
      chainIdOrSlug: params.chainIdOrSlug,
      contractAddress: params.contractAddress,
    }),
  );
}
